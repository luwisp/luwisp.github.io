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
    property bool isMobile: width < 800
    property var tocList: []
    property string currentArticleContent: ""
    
    property string currentArticleTitle: ""
    property var uniqueTags: []
    property string targetExpandedTag: ""
    BlogManager {
        id: blogManager
        // 自动识别平台：如果编译为WebAssembly则走远端GitHub，否则走本地路径
        baseUrl: Qt.platform.os === "wasm" ? "https://raw.githubusercontent.com/luoronger/luoronger.github.io/main/assert" : "file:///mnt/d/Code/code/front-end/homepage/assert"
        Component.onCompleted: loadData()
        
        onArticleLoaded: function(title, content, date, tags) {
            window.currentArticleTitle = title
            window.currentArticleContent = content

            var toc = [];
            var lines = content.split("\n");
            var charCount = 0;
            for (var i = 0; i < lines.length; i++) {
                var match = lines[i].match(/^(#{1,6})\s+(.*)/);
                if (match) {
                    toc.push({ level: match[1].length, text: match[2], line: i, charIdx: charCount });
                }
                charCount += lines[i].length + 1; // +1 for the newline
            }
            window.tocList = toc; console.log("TOC parsed length:", toc.length); console.log("isMobile is:", window.isMobile, "Width is:", window.width); console.log("TOC parsed length:", toc.length); console.log("isMobile is:", window.isMobile, "Width is:", window.width);

            window.isArticleView = true
        }
        
        onArticleLoadFailed: function(errorMsg) {
            window.currentArticleTitle = "Error"
            window.currentArticleContent = "# Loading Failed\n\n" + errorMsg
            window.isArticleView = true
        }

        
        onAllArticlesChanged: {
            var tagsSet = {};
            for (var i = 0; i < blogManager.allArticles.length; i++) {
                var art = blogManager.allArticles[i];
                if (art.tags) {
                    var tArr = art.tags.split(",");
                    for (var j = 0; j < tArr.length; j++) {
                        if (tArr[j]) tagsSet[tArr[j]] = true;
                    }
                }
            }
            var result = [];
            for (var k in tagsSet) result.push(k);
            window.uniqueTags = result;
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
                ctx.moveTo(0, centerY + Math.sin(phase) * amplitude)
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

            // Check if point overlaps with center text "LUORONG"
            property bool overlapsCenter: Math.abs(computedX - window.width / 2) < 200 && Math.abs(computedY - window.height / 2) < 80

            // Shift away if overlapping
            x: overlapsCenter ? (computedX < window.width / 2 ? computedX - 100 : computedX + 100) : computedX
            y: overlapsCenter ? (computedY < window.height / 2 ? computedY - 60 : computedY + 60) : computedY
            
            // Randomly select a tag for this point
            property string myTag: (window.uniqueTags.length > 0) ? window.uniqueTags[Math.floor(Math.abs(Math.sin((index + 1) * 12.3)) * window.uniqueTags.length)] : ""

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
                id: tagText
                anchors.left: dot.right
                anchors.leftMargin: 8
                anchors.verticalCenter: dot.verticalCenter
                text: showText && myTag !== "" ? myTag : ""
                font.pixelSize: 14
                color: mouseArea.containsMouse ? "#000000" : "#666666" 
                font.bold: mouseArea.containsMouse
            }
            
            MouseArea {
                id: mouseArea
                anchors.left: dot.left
                anchors.right: tagText.right
                anchors.top: tagText.top
                anchors.bottom: tagText.bottom
                anchors.margins: -5
                hoverEnabled: true
                cursorShape: (showText && myTag !== "") ? Qt.PointingHandCursor : Qt.ArrowCursor
                onClicked: {
                    if (showText && myTag !== "") {
                        window.isDrawerOpen = true
                        window.navIndex = 1
                        window.isArticleView = false
                        window.targetExpandedTag = myTag
                    }
                }
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
            anchors.rightMargin: window.isMobile ? 15 : 40
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
                            window.targetExpandedTag = ""
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
                onClicked: { isDrawerOpen = !isDrawerOpen; window.targetExpandedTag = ""; }
            }
        }

        // Real Content Area replacing Mock
        Item {
            anchors.top: parent.top
            anchors.topMargin: 60
            anchors.bottom: parent.bottom
            width: isMobile ? parent.width * 0.95 : parent.width * 0.7
            anchors.horizontalCenter: parent.horizontalCenter
            opacity: isDrawerOpen ? 1.0 : 0.0
            Behavior on opacity { NumberAnimation { duration: 1000; easing.type: Easing.InQuad } }

            // HOME PAGE
            ListView {
                anchors.fill: parent
                spacing: 20
                clip: true
                visible: window.navIndex === 0 && !window.isArticleView
                
                // header: Item {
                //     width: parent.width
                //     height: 180
                //     Rectangle {
                //         anchors.fill: parent
                //         anchors.bottomMargin: 20
                //         color: "#222222"
                //         radius: 10
                //         Text {
                //             anchors.centerIn: parent
                //             text: ""
                //             color: "#ffffff"
                //             font.pixelSize: 24
                //             font.bold: true
                //             horizontalAlignment: Text.AlignHCenter
                //         }
                //     }
                // }
                
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
                id: catFlickable
                anchors.fill: parent
                contentHeight: catCol.height
                ScrollBar.vertical: ScrollBar { active: catFlickable.moving || catFlickable.movingVertically || pressed }
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
                                targetTag: window.targetExpandedTag
                            }
                        }
                    }
                }
            }

            // ABOUT PAGE
            Flickable {
                id: aboutFlickable
                anchors.fill: parent
                contentHeight: aboutCol.height
                ScrollBar.vertical: ScrollBar { active: aboutFlickable.moving || aboutFlickable.movingVertically || pressed }
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
                            Text { text: "Personal Info"; color: "#ffffff"; font.pixelSize: 24; font.bold: true; anchors.horizontalCenter: parent.horizontalCenter }
                            Text { text: "ID: luoronger\n\n南软大二在读"; color: "#bbbbbb"; font.pixelSize: 16; horizontalAlignment: Text.AlignHCenter; anchors.horizontalCenter: parent.horizontalCenter }
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
                            Text { text: "Blog Info"; color: "#ffffff"; font.pixelSize: 24; font.bold: true; anchors.horizontalCenter: parent.horizontalCenter }
                            Text { text: "驱动引擎: Qt Quick (C++ & QML)\n前端架构: WebAssembly"; color: "#bbbbbb"; font.pixelSize: 16; horizontalAlignment: Text.AlignHCenter; anchors.horizontalCenter: parent.horizontalCenter }
                        }
                    }
                    
                    Row {
                        anchors.horizontalCenter: parent.horizontalCenter
                        spacing: 30
                        
                        // GitHub Button
                        Rectangle {
                            width: 60
                            height: 60
                            radius: 30
                            color: "#333333"
                            border.color: "#555555"
                            border.width: 1
                            
                            Text {
                                text: "GH"
                                color: "#ffffff"
                                anchors.centerIn: parent
                                font.bold: true
                                font.pixelSize: 18
                            }
                            
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                hoverEnabled: true
                                onEntered: parent.color = "#444444"
                                onExited: parent.color = "#333333"
                                onClicked: Qt.openUrlExternally("https://github.com/luoronger") // Placeholder GitHub URL
                            }
                        }
                        
                        // Email Button
                        Rectangle {
                            width: 60
                            height: 60
                            radius: 30
                            color: "#333333"
                            border.color: "#555555"
                            border.width: 1
                            
                            Text {
                                text: "EM"
                                color: "#ffffff"
                                anchors.centerIn: parent
                                font.bold: true
                                font.pixelSize: 18
                            }
                            
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                hoverEnabled: true
                                onEntered: parent.color = "#444444"
                                onExited: parent.color = "#333333"
                                onClicked: Qt.openUrlExternally("mailto:241276025@smail.nju.edu.cn") // Placeholder Email
                            }
                        }
                    }
                }
            }
            // ARTICLE DETAIL VIEW
            Flickable {
                id: articleFlickable
                anchors.fill: parent
                contentHeight: articleDetailCol.height
                ScrollBar.vertical: ScrollBar { active: articleFlickable.moving || articleFlickable.movingVertically || pressed }
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
                    
                                        // Mobile TOC
                    Rectangle {
                        width: parent.width
                        height: tocContentMobile.contentHeight + 20
                        visible: window.isMobile && window.tocList.length > 0
                        color: "#2a2a2a"
                        radius: 8
                        
                        Text {
                            id: mobileTocTitle
                            text: "Table of Contents"
                            color: "#aaaaaa"
                            font.bold: true
                            anchors.top: parent.top
                            anchors.topMargin: 10
                            anchors.left: parent.left
                            anchors.leftMargin: 15
                        }

                        ListView {
                            id: tocContentMobile
                            anchors.top: mobileTocTitle.bottom
                            anchors.topMargin: 10
                            anchors.left: parent.left
                            anchors.right: parent.right
                            height: contentHeight
                            interactive: false
                            model: window.tocList
                            delegate: Item {
                                width: parent.width
                                height: 30
                                Text {
                                    text: modelData.text
                                    color: tocMouseMobile.containsMouse ? "#ffffff" : "#cccccc"
                                    font.pixelSize: 14
                                    anchors.left: parent.left
                                    anchors.leftMargin: 15 + (modelData.level - 1) * 15
                                    anchors.verticalCenter: parent.verticalCenter
                                }
                                MouseArea {
                                    id: tocMouseMobile
                                    anchors.fill: parent
                                    hoverEnabled: true
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: {
                                        console.log("Clicked:", modelData.text, "line:", modelData.line);
                        console.log("Clicked:", modelData.text, "line:", modelData.line);
                        var charRatio = modelData.charIdx / Math.max(1, window.currentArticleContent.length);
                        var targetY = 40 + charRatio * mdText.height * 0.99; // Slight tweak for middle offset
                                        var maxScroll = Math.max(0, articleFlickable.contentHeight - articleFlickable.height);
                                        if (targetY > maxScroll) targetY = maxScroll;
                                        if (targetY < 0) targetY = 0;
                                        articleFlickable.contentY = targetY;
                                    }
                                }
                            }
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
                            anchors.leftMargin: window.isMobile ? 15 : 40
                            anchors.right: parent.right
                            anchors.rightMargin: window.isMobile ? 15 : 40
                            textFormat: Text.MarkdownText
                            text: window.currentArticleContent
                            color: "#dddddd"
                            font.pixelSize: 16
                            wrapMode: Text.WordWrap
                            onLinkActivated: function(link) { Qt.openUrlExternally(link) }
                            MouseArea {
                                anchors.fill: parent
                                acceptedButtons: Qt.NoButton
                                cursorShape: parent.hoveredLink ? Qt.PointingHandCursor : Qt.ArrowCursor
                            }
                        }
                    }
                }
            }
        }
    }

    // Desktop TOC Sidebar
    Rectangle {
        width: window.width * 0.15 - 20
        height: window.height * 0.6
        x: window.width * 0.85 + 10  // 0.7/2 + 0.5 = 0.85 center align means right is at 0.85
        y: 100
        color: "transparent"
        visible: !window.isMobile && window.tocList.length > 0 && window.isArticleView && window.isDrawerOpen
        z: 9999
        
        Text {
            id: desktopTocTitle
            text: "Contents"
            color: "#999999"
            font.bold: true
            font.pixelSize: 16
            anchors.top: parent.top
            anchors.left: parent.left
        }
        
        ListView {
            id: tocContentDesktop
            anchors.top: desktopTocTitle.bottom
            anchors.topMargin: 15
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.bottom: parent.bottom
            clip: true
            model: window.tocList
            ScrollBar.vertical: ScrollBar { }
            interactive: true
            boundsBehavior: Flickable.StopAtBounds
            delegate: Item {
                width: parent.width
                height: 28
                Text {
                    text: modelData.text
                    color: tocMouseDesktop.containsMouse ? "#ffffff" : "#888888"
                    font.pixelSize: 14
                    elide: Text.ElideRight
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.leftMargin: (modelData.level - 1) * 12
                    anchors.verticalCenter: parent.verticalCenter
                }
MouseArea {
                    id: tocMouseDesktop
                    anchors.fill: parent
                    hoverEnabled: true
                    preventStealing: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: {
                        console.log("Desktop Clicked:", modelData.text, "charIdx:", modelData.charIdx);
                        var charRatio = modelData.charIdx / Math.max(1, window.currentArticleContent.length);
                        var targetY = 40 + charRatio * mdText.height * 0.95; // Slight tweak for middle offset
                        var maxScroll = Math.max(0, articleFlickable.contentHeight - articleFlickable.height);
                        if (targetY > maxScroll) targetY = maxScroll;
                        if (targetY < 0) targetY = 0;
                        articleFlickable.contentY = targetY;
                        articleFlickable.forceActiveFocus();
                    }
                }
            }
        }
    }
}
