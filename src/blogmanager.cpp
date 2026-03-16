#include "blogmanager.h"
#include <QDir>
#include <QFileInfo>
#include <QDirIterator>
#include <QNetworkAccessManager>
#include <QNetworkRequest>
#include <QNetworkReply>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QDateTime>
#include <QRegularExpression>
#include <utility>

BlogManager::BlogManager(QObject *parent) : QObject(parent)
{
}

QString BlogManager::baseUrl() const { return m_baseUrl; }

void BlogManager::setBaseUrl(const QString &url)
{
    if (m_baseUrl != url) {
        m_baseUrl = url;
        emit baseUrlChanged();
    }
}

QVariantList BlogManager::treeData() const { return m_treeData; }
QVariantList BlogManager::allArticles() const { return m_allArticles; }

void BlogManager::loadData()
{
    m_treeData.clear();
    m_allArticles.clear();

    if (m_baseUrl.startsWith("file://")) {
        // Local path
        QString path = m_baseUrl.mid(7);
#ifdef Q_OS_WIN
        if (path.startsWith("/")) path = path.mid(1);
#endif
                QString mdPath = path + "/markdown";
        QDir dir(mdPath);
        if (!dir.exists()) {
            dir.setPath(path); // fallback 
        }
        if (dir.exists()) {
            QFileInfoList entries = dir.entryInfoList(QDir::Dirs | QDir::NoDotAndDotDot);
            for (const QFileInfo &info : entries) {
                QString name = info.fileName();
                if (name == "image" || name == "picture") continue;
                QVariantMap rootNode = parseDirectory(info.absoluteFilePath(), {name}, name);
                if (!rootNode.isEmpty()) {
                    m_treeData.append(rootNode);
                }
            }
            emit treeDataChanged();
            emit allArticlesChanged();
        }
    } else if (m_baseUrl.startsWith("http")) {
        // Needs a pre-generated map or index.json since static raw github doesn't support dir listing.
        // For demonstration, fetch an expected index.json from the baseUrl.
        fetchRemoteTree();
    }
}

QVariantMap BlogManager::parseDirectory(const QString &dirPath, const QStringList &parentTags, const QString &relPath)
{
    QDir dir(dirPath);
    QVariantMap node;
    node["name"] = dir.dirName();
    node["isDir"] = true;
    node["expanded"] = false; // Default collapsed
    
    QVariantList children;
    
    // First dirs
    QFileInfoList dirs = dir.entryInfoList(QDir::Dirs | QDir::NoDotAndDotDot);
    for (const QFileInfo &subDir : dirs) {
        QString name = subDir.fileName();
        if (name == "image" || name == "picture") continue;
        QStringList tags = parentTags;
        tags.append(name);
        QVariantMap childNode = parseDirectory(subDir.absoluteFilePath(), tags, relPath + "/" + name);
        if (!childNode.isEmpty()) {
            children.append(childNode);
        }
    }
    
    // Then files
    QFileInfoList files = dir.entryInfoList(QStringList() << "*.md", QDir::Files);
    for (const QFileInfo &file : files) {
        QVariantMap fileNode;
        fileNode["name"] = file.fileName();
        fileNode["isDir"] = false;
        fileNode["path"] = relPath + "/" + file.fileName(); // relative path
        fileNode["tags"] = parentTags.join(",");
        fileNode["date"] = file.birthTime().toString("yyyy-MM-dd");
        fileNode["title"] = file.completeBaseName();
        children.append(fileNode);

        m_allArticles.append(fileNode); // add to flat list for HOME view
    }
    
    if (children.isEmpty()) return QVariantMap();
    
    node["childNodes"] = children;
    return node;
}

void BlogManager::fetchRemoteTree()
{
    // Try to load tree.json
    auto *manager = new QNetworkAccessManager(this);
    QNetworkRequest request{QUrl(m_baseUrl + "/tree.json")};
    QNetworkReply *reply = manager->get(request);
    connect(reply, &QNetworkReply::finished, this, [this, reply, manager]() {
        if (reply->error() == QNetworkReply::NoError) {
            QJsonDocument doc = QJsonDocument::fromJson(reply->readAll());
            if (doc.isObject()) {
                m_treeData = doc.object().value("tree").toArray().toVariantList();
                m_allArticles = doc.object().value("articles").toArray().toVariantList();
                emit treeDataChanged();
                emit allArticlesChanged();
            }
        } else {
            // Provide dummy error data or handle
            qWarning() << "Failed to fetch tree.json:" << reply->errorString();
        }
        reply->deleteLater();
        manager->deleteLater();
    });
}



QString processMarkdownContent(const QString& content, const QString& baseUrl) {
    QString result = content;
    // Replace markdown image paths like ](./images/...) or ](../images/...) to ](baseUrl/images/...)
    QRegularExpression re1(R"(\]\((?:\.|\/)*images\/)");
    result.replace(re1, "](" + baseUrl + "/images/");
    
    // Replace html image paths
    QRegularExpression re2(R"(src=["'](?:\.|\/)*images\/)");
    result.replace(re2, "src=\"" + baseUrl + "/images/");
    
    return result;
}

void BlogManager::fetchArticle(const QString& relativePath)
{
        QString fullUrl = m_baseUrl + "/markdown/" + relativePath;
    if (!m_baseUrl.startsWith("http")) { // local check if markdown folder exists
        QString mdPath = m_baseUrl.mid(7) + "/markdown";
        if (!QDir(mdPath).exists()) {
            fullUrl = m_baseUrl + "/" + relativePath;
        }
    }

    // Find article metadata for title, tags, date
    QString title = "Unknown", tags = "", date = "";
    for (const QVariant &v : std::as_const(m_allArticles)) {
        QVariantMap m = v.toMap();
        if (m["path"].toString() == relativePath) {
            title = m["title"].toString();
            tags = m["tags"].toString();
            date = m["date"].toString();
            break;
        }
    }

    if (fullUrl.startsWith("file://")) {
        QString path = fullUrl.mid(7);
#ifdef Q_OS_WIN
        if (path.startsWith("/")) path = path.mid(1);
#endif
        QFile file(path);
        if (file.open(QIODevice::ReadOnly | QIODevice::Text)) {
            QString content = QString::fromUtf8(file.readAll());
            content = processMarkdownContent(content, m_baseUrl);
            emit articleLoaded(title, content, date, tags);
        } else {
            emit articleLoadFailed("Local file could not be open: " + path);
        }
    } else {
        auto *manager = new QNetworkAccessManager(this);
        QNetworkRequest request{QUrl(fullUrl)};
        QNetworkReply *reply = manager->get(request);
        connect(reply, &QNetworkReply::finished, this, [this, reply, manager, title, date, tags]() {
            if (reply->error() == QNetworkReply::NoError) {
                QString content = QString::fromUtf8(reply->readAll());
                content = processMarkdownContent(content, m_baseUrl);
                emit articleLoaded(title, content, date, tags);
            } else {
                emit articleLoadFailed("Network error: " + reply->errorString());
            }
            reply->deleteLater();
            manager->deleteLater();
        });
    }
}
