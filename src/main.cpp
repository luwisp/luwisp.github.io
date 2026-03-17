#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QFontDatabase>
#include <QFont>
#include "blogmanager.h"
using namespace Qt::StringLiterals;
int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);

#ifdef Q_OS_WASM
    int fontId = QFontDatabase::addApplicationFont(":/homepage/fonts/NotoSansCJK-Regular.ttc");
    if (fontId != -1) {
        QStringList fontFamilies = QFontDatabase::applicationFontFamilies(fontId);
        if (!fontFamilies.isEmpty()) {
            QFont font(fontFamilies.at(0));
            app.setFont(font);
        }
    }
#endif

    qmlRegisterType<BlogManager>("Blog", 1, 0, "BlogManager");

    QQmlApplicationEngine engine;
    const QUrl url(u"qrc:/homepage/qml/main.qml"_s);
    QObject::connect(&engine, &QQmlApplicationEngine::objectCreated,
        &app, [url](QObject *obj, const QUrl &objUrl) {
            if (!obj && url == objUrl)
                QCoreApplication::exit(-1);
        }, Qt::QueuedConnection);
    engine.load(url);

    return app.exec();
}
