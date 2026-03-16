#ifndef BLOGMANAGER_H
#define BLOGMANAGER_H

#include <QObject>
#include <QVariantMap>
#include <QVariantList>
#include <QString>

class BlogManager : public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString baseUrl READ baseUrl WRITE setBaseUrl NOTIFY baseUrlChanged)
    Q_PROPERTY(QVariantList treeData READ treeData NOTIFY treeDataChanged)
    Q_PROPERTY(QVariantList allArticles READ allArticles NOTIFY allArticlesChanged)

public:
    explicit BlogManager(QObject *parent = nullptr);

    QString baseUrl() const;
    void setBaseUrl(const QString &url);

    QVariantList treeData() const;
    QVariantList allArticles() const;

    Q_INVOKABLE void loadData();
    Q_INVOKABLE void fetchArticle(const QString& relativePath);

signals:
    void baseUrlChanged();
    void treeDataChanged();
    void allArticlesChanged();
    void articleLoaded(const QString &title, const QString &content, const QString &date, const QString &tags);
    void articleLoadFailed(const QString &errorMsg);

private:
    QString m_baseUrl;
    QVariantList m_treeData;
    QVariantList m_allArticles;

    QVariantMap parseDirectory(const QString &path, const QStringList &parentTags, const QString &relPath);
    void fetchRemoteTree();
    void fetchRemoteArticle(const QString &url, const QString &title, const QString &date, const QString &tags);
};

#endif // BLOGMANAGER_H
