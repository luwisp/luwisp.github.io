import QtQuick
import QtQuick.Window
import QtQuick.Controls
import Blog 1.0

Window {
    id: window
    width: 1280
    height: 720
    visible: true
    title: qsTr("LUORONG's Homepage")

    property bool isDrawerOpen: false
    property real time: 0
    property real baseCoordX: Math.random() * 100 - 50
    property real baseCoordY: Math.random() * 100 - 50

    property int navIndex: 0
    property bool isArticleView: false
    property string currentArticleContent: ""
    property string currentArticleTitle: ""

    BlogManager {
        id: blogManager
        baseUrl: "file:///mnt/d/Code/code/front-end/homepage/assert"
        Component.onCompleted: loadData()
        
        onArticleLoaded: function(title, content, date, tags) {
            window.currentArticleTitle = title
            window.currentArticleContent = content
            window.isArticleView = true
        }
        
        onArticleLoadFailed: function(errorMsg) {
            window.currentArticleTitle = "Error"
            window.currentArticleContent = "# Loading Failed\n\n" + errorMsg
            window.isArticleView = true
        }
    }

    // Timer for wave and points animations
    Timer {
        interval: 16 // ~60fps
        running: true
        repeat: true
        onTriggered: {
            time += 0.05
            waveCanvas.requestPaint()
        }
    }

    // Main background transitioning from white to dark
    Rectangle {
        id: bgRec
        anchors.fill: parent
        color: isDrawerOpen ? "#121212" : "#ffffff"
        Behavior on color {
            ColorAnimation { duration: 800; easing.type: Easing.InOutQuad }
        }
    }

    // Mathematical Grid Background
    Canvas {
        id: gridCanvas
        anchors.fill: parent
        opacity: isDrawerOpen ? 0.0 : 1.0
        Behavior on opacity { NumberAnimation { duration: 600 } }

        onPaint: {
            var ctx = getContext("2d")
            ctx.clearRect(0, 0, width, height)
            ctx.strokeStyle = "#e5e5e5"
            ctx.lineWidth = 1

            for (var x = 0; x < width; x += 50) {
                ctx.beginPath()
                ctx.moveTo(x, 0)
                ctx.lineTo(x, height)
                ctx.stroke()
            }
            for (var y = 0; y < height; y += 50) {
                ctx.beginPath()
                ctx.moveTo(0, y)
                ctx.lineTo(width, y)
                ctx.stroke()
            }
        }
    }

    // Dynamic wave shapes and central broken line
    Canvas {
        id: waveCanvas
        anchors.fill: parent
        opacity: isDrawerOpen ? 0.1 : 1.0  // Becomes dim/gray in dark mode
        Behavior on opacity { NumberAnimation { duration: 800 } }

        onPaint: {
            var ctx = getContext("2d")
            ctx.clearRect(0, 0, width, height)

            var centerY = height / 2

            // Draw center horizontal line with gap in the middle for LUORONG text
            ctx.strokeStyle = isDrawerOpen ? "#555555" : "#000000"
            ctx.lineWidth = 1.5
            ctx.beginPath()
            var gapStart = width/2 - 160
            var gapEnd = width/2 + 150
            ctx.moveTo(0, centerY)
            ctx.lineTo(gapStart, centerY)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(gapEnd, centerY)
            ctx.lineTo(width, centerY)
            ctx.stroke()

            // Draw the two intersecting sine waves
            var drawWave = function(offset, amplitude, frequency, phase, color, isFill) {
                ctx.beginPath()
                ctx.moveTo(0, centerY)
                for (var x = 0; x <= width; x += 5) {
                    var y = centerY + Math.sin(x * frequency + phase) * amplitude
                    ctx.lineTo(x, y)
                }
                
                if (isFill) {
                    ctx.lineTo(width, height)
                    ctx.lineTo(0, height)
                    ctx.closePath()
                    var gradient = ctx.createLinearGradient(0, centerY, 0, height)
                    gradient.addColorStop(0, "rgba(200, 200, 200, 0.3)")
                    gradient.addColorStop(1, "rgba(255, 255, 255, 0.0)")
                    ctx.fillStyle = gradient
                    ctx.fill()
                } else {
                    ctx.strokeStyle = color
                    ctx.lineWidth = 2
                    ctx.stroke()
                }
            }

            // Draw shadow/gradients first
            drawWave(0, 100, 0.005, time, "", true)
            drawWave(0, 120, 0.004, -time * 0.8, "", true)

            // Draw solid wave lines
            drawWave(0, 100, 0.005, time, isDrawerOpen ? "#555555" : "#000000", false)
            drawWave(0, 120, 0.004, -time * 0.8, isDrawerOpen ? "#444444" : "#888888", false)
        }
    }

    // Center ID Text - LUORONG
    Item {
        anchors.centerIn: parent
        width: 300
        height: 60
        opacity: isDrawerOpen ? 0.0 : 1.0
        Behavior on opacity { NumberAnimation { duration: 600 } }

        Text {
            anchors.centerIn: parent
            text: "LUORONG"
            font.family: "Helvetica, Arial, sans-serif"
            font.pixelSize: 48
            font.letterSpacing: 10
            font.bold: true
            color: "#000000"
        }
    }

    // Scattered decorative points & formulas
    Repeater {
        model: 12 // 4x3 grid to distribute points uniformly
        Item {
            // Distribute across grid to avoid cluttering in one place
            property real col: index % 4
            property real row: Math.floor(index / 4)
            // Generate random offsets inside each cell (10% to 90% space of cell)
            property real randOffsetX: 0.1 + Math.random() * 0.8
            property real randOffsetY: 0.1 + Math.random() * 0.8
            // 20% chance to not show text
            property bool showText: Math.random() > 0.2

            property real computedX: col * (window.width / 4) + randOffsetX * (window.width / 4)
            property real computedY: row * (window.height / 3) + randOffsetY * (window.height / 3)

            // Check if point overlaps with center text "LUORONG" (width ~300, height ~60, with margins)
            property bool overlapsCenter: Math.abs(computedX - window.width / 2) < 200 && Math.abs(computedY - window.height / 2) < 80

            // Shift away if overlapping
            x: overlapsCenter ? (computedX < window.width / 2 ? computedX - 100 : computedX + 100) : computedX
            y: overlapsCenter ? (computedY < window.height / 2 ? computedY - 60 : computedY + 60) : computedY
            
            // Calculate realistic coordinates based on a random math origin at the bottom-left
            property real mathX: window.baseCoordX + (x / window.width) * 100
            property real mathY: window.baseCoordY + ((window.height - y) / window.height) * 100

            opacity: isDrawerOpen ? 0.0 : 0.7
            Behavior on opacity { NumberAnimation { duration: 600 } }

            Rectangle {
                id: dot
                width: 6; height: 6
                radius: 3
                color: "#333333"
                anchors.centerIn: parent

                SequentialAnimation on scale {
                    running: true
                    loops: Animation.Infinite
                    NumberAnimation { to: 2.0; duration: 1500 + Math.random() * 1000; easing.type: Easing.InOutSine }
                    NumberAnimation { to: 1.0; duration: 1500 + Math.random() * 1000; easing.type: Easing.InOutSine }
                }
            }

            Text {
                anchors.left: dot.right
                anchors.leftMargin: 8
                anchors.verticalCenter: dot.verticalCenter
                text: showText ? "(" + mathX.toFixed(1) + ", " + mathY.toFixed(1) + ")" : ""
                font.pixelSize: 12
                color: "#666666"
            }
        }
    }

    // Top Bar (Fades in when drawer is opened)
    Rectangle {
        id: topBar
        width: parent.width
        height: 60
        color: "#1a1a1a"
        y: isDrawerOpen ? 0 : -height
        opacity: isDrawerOpen ? 1.0 : 0.0
        Behavior on y { NumberAnimation { duration: 600; easing.type: Easing.OutExpo } }
        Behavior on opacity { NumberAnimation { duration: 600 } }
        
        Text {
            anchors.verticalCenter: parent.verticalCenter
            anchors.left: parent.left
            anchors.leftMargin: 20
            text: "LUORONG's BLOG"
            color: "#ffffff"
            font.pixelSize: 20
            font.bold: true
            font.letterSpacing: 2
        }

        Row {
            anchors.right: parent.right
            anchors.rightMargin: 40
            anchors.verticalCenter: parent.verticalCenter
            spacing: 30
            Repeater {
                model: ["Home", "Category", "About"]
                Text {
                    text: modelData
                    color: window.navIndex === index ? "#ffffff" : "#888888"
                    font.pixelSize: 18
                    font.bold: window.navIndex === index
                    
                    MouseArea {
                        anchors.fill: parent
                        anchors.margins: -10
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            window.navIndex = index
                            window.isArticleView = false
                        }
                    }
                }
            }
        }
    }

    // Blog Drawer Content (Slides up from bottom)
    Rectangle {
        id: blogContent
        width: parent.width
        height: parent.height - topBar.height
        color: "transparent"
        x: 0
        y: isDrawerOpen ? topBar.height : parent.height - 60
        Behavior on y { NumberAnimation { duration: 800; easing.type: Easing.OutExpo } }

        // Up/Down Arrow Indicator
        Item {
            width: parent.width
            height: 60
            anchors.top: parent.top

            Text {
                anchors.centerIn: parent
                text: isDrawerOpen ? "∨" : "∧"
                font.pixelSize: 24
                color: isDrawerOpen ? "#ffffff" : "#000000"
                
                SequentialAnimation on y {
                    running: !isDrawerOpen
                    loops: Animation.Infinite
                    NumberAnimation { to: 10; duration: 600; easing.type: Easing.InOutSine }
                    NumberAnimation { to: 0; duration: 600; easing.type: Easing.InOutSine }
                }
            }

            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: isDrawerOpen = !isDrawerOpen
            }
        }

        // Real Content Area replacing Mock
        Item {
            anchors.top: parent.top
            anchors.topMargin: 60
            anchors.bottom: parent.bottom
            width: parent.width * 0.7
            anchors.horizontalCenter: parent.horizontalCenter
            opacity: isDrawerOpen ? 1.0 : 0.0
            Behavior on opacity { NumberAnimation { duration: 1000; easing.type: Easing.InQuad } }

            // HOME PAGE
            ListView {
                anchors.fill: parent
                spacing: 20
                clip: true
                visible: window.navIndex === 0 && !window.isArticleView
                
                header: Item {
                    width: parent.width
                    height: 180
                    Rectangle {
                        anchors.fill: parent
                        anchors.bottomMargin: 20
                        color: "#222222"
                        radius: 10
                        Text {
                            anchors.centerIn: parent
                            text: "欢迎来到 LUORONG 的空间\n这是一场数学与科幻的旅行"
                            color: "#ffffff"
                            font.pixelSize: 24
                            font.bold: true
                            horizontalAlignment: Text.AlignHCenter
                        }
                    }
                }
                
                model: blogManager.allArticles
                delegate: Rectangle {
                    width: parent.width
                    height: 140
                    color: "#222222"
                    radius: 10
                    
                    Column {
                        anchors.fill: parent
                        anchors.margins: 20
                        spacing: 12
                        Text { text: modelData.title; color: "#ffffff"; font.pixelSize: 22; font.bold: true }
                        Text { text: modelData.date; color: "#aaaaaa"; font.pixelSize: 14 }
                        Row {
                            spacing: 10
                            Repeater {
                                model: modelData.tags ? modelData.tags.split(",") : []
                                Rectangle {
                                    width: tagText.width + 16
                                    height: 24
                                    radius: 12
                                    color: "#444444"
                                    Text { 
                                        id: tagText
                                        anchors.centerIn: parent
                                        text: modelData
                                        color: "#dddddd"
                                        font.pixelSize: 12 
                                    }
                                }
                            }
                        }
                    }
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            blogManager.fetchArticle(modelData.path)
                        }
                    }
                }
            }

            // CATEGORY PAGE
            Flickable {
                anchors.fill: parent
                contentHeight: catCol.height
                clip: true
                visible: window.navIndex === 1 && !window.isArticleView
                
                Column {
                    id: catCol
                    width: parent.width
                    spacing: 30
                    Text { text: "CATEGORIES"; color: "#ffffff"; font.pixelSize: 32; font.bold: true }
                    
                    Column {
                        width: parent.width
                        spacing: 5
                        Repeater {
                            model: blogManager.treeData
                            delegate: TreeNode {
                                nodeData: modelData
                                indentLevel: 0
                            }
                        }
                    }
                }
            }

            // ABOUT PAGE
            Flickable {
                anchors.fill: parent
                contentHeight: aboutCol.height
                clip: true
                visible: window.navIndex === 2 && !window.isArticleView
                
                Column {
                    id: aboutCol
                    width: parent.width
                    spacing: 20
                    
                    Rectangle {
                        width: parent.width
                        height: 200
                        color: "#222222"
                        radius: 10
                        Column {
                            anchors.centerIn: parent
                            spacing: 15
                            Text { text: "个人信息 (Personal Info)"; color: "#ffffff"; font.pixelSize: 24; font.bold: true; anchors.horizontalCenter: parent.horizontalCenter }
                            Text { text: "ID: LUORONG\nEmail: contact@example.com\n\n热爱数学与科幻的开发者，在黑白的光影中探寻宇宙的浪漫。"; color: "#bbbbbb"; font.pixelSize: 16; horizontalAlignment: Text.AlignHCenter; anchors.horizontalCenter: parent.horizontalCenter }
                        }
                    }
                    
                    Rectangle {
                        width: parent.width
                        height: 200
                        color: "#222222"
                        radius: 10
                        Column {
                            anchors.centerIn: parent
                            spacing: 15
                            Text { text: "博客信息 (Blog Info)"; color: "#ffffff"; font.pixelSize: 24; font.bold: true; anchors.horizontalCenter: parent.horizontalCenter }
                            Text { text: "驱动引擎: Qt Quick (C++ & QML)\n前端架构: WebAssembly\n设计语言: 无尽数学几何与极简波函数"; color: "#bbbbbb"; font.pixelSize: 16; horizontalAlignment: Text.AlignHCenter; anchors.horizontalCenter: parent.horizontalCenter }
                        }
                    }
                }
            }

            // ARTICLE DETAIL VIEW
            Flickable {
                anchors.fill: parent
                contentHeight: articleDetailCol.height
                clip: true
                visible: window.isArticleView
                
                Column {
                    id: articleDetailCol
                    width: parent.width
                    spacing: 20
                    
                    Rectangle {
                        width: 120
                        height: 40
                        color: "#333333"
                        radius: 6
                        Text { anchors.centerIn: parent; text: "← Back"; color: "#ffffff"; font.pixelSize: 16; font.bold: true }
                        MouseArea { 
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: window.isArticleView = false 
                        }
                    }
                    
                    Rectangle {
                        width: parent.width
                        height: Math.max(mdText.height + 80, 500)
                        color: "#222222"
                        radius: 10
                        
                        Text {
                            id: mdText
                            anchors.top: parent.top
                            anchors.topMargin: 40
                            anchors.left: parent.left
                            anchors.leftMargin: 40
                            anchors.right: parent.right
                            anchors.rightMargin: 40
                            textFormat: Text.MarkdownText
                            text: window.currentArticleContent
                            color: "#dddddd"
                            font.pixelSize: 16
                            wrapMode: Text.WordWrap
                        }
                    }
                }
            }
        }
    }
}