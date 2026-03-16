#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include "blogmanager.h"

int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);

    qmlRegisterType<BlogManager>("Blog", 1, 0, "BlogManager");

    QQmlApplicationEngine engine;
    const QUrl url(u"qrc:/homepage/qml/main.qml"_qs);
    QObject::connect(&engine, &QQmlApplicationEngine::objectCreated,
        &app, [url](QObject *obj, const QUrl &objUrl) {
            if (!obj && url == objUrl)
                QCoreApplication::exit(-1);
        }, Qt::QueuedConnection);
    engine.load(url);

    return app.exec();
}
