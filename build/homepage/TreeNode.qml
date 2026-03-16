import QtQuick
import QtQuick.Controls

Column {
    id: root
    property var nodeData: null
    property int indentLevel: 0
    property bool isExpanded: false
    
    spacing: 5
    width: parent ? parent.width : 400

    Item {
        width: parent.width
        height: 40

        Rectangle {
            anchors.fill: parent
            color: mouseArea.containsMouse ? "#333333" : "transparent"
            radius: 5
        }

        Row {
            anchors.fill: parent
            anchors.leftMargin: root.indentLevel * 20 + 10
            spacing: 10
            
            Text {
                text: root.nodeData ? (root.nodeData.isDir ? (root.isExpanded ? "📂" : "📁") : "📄") : ""
                color: "#aaaaaa"
                font.pixelSize: 16
                anchors.verticalCenter: parent.verticalCenter
            }
            
            Text {
                text: root.nodeData ? root.nodeData.name : ""
                color: "#ffffff"
                font.pixelSize: 16
                anchors.verticalCenter: parent.verticalCenter
            }
        }

        MouseArea {
            id: mouseArea
            anchors.fill: parent
            hoverEnabled: true
            cursorShape: Qt.PointingHandCursor
            onClicked: {
                if (root.nodeData) {
                    if (root.nodeData.isDir) {
                        root.isExpanded = !root.isExpanded
                        console.log("Expanding dir " + root.nodeData.name + " - children length: " + (root.nodeData.children ? root.nodeData.children.length : "null"))
                    } else {
                        // It's a file, load it
                        blogManager.fetchArticle(root.nodeData.path)
                    }
                }
            }
        }
    }

    Column {
        id: childrenCol
        width: parent.width
        visible: root.nodeData && root.nodeData.isDir && root.isExpanded
        spacing: 5

        Repeater {
            model: (root.nodeData && root.nodeData.children !== undefined) ? root.nodeData.children : []
            delegate: Loader {
                width: childrenCol.width
                height: item ? item.height : 0
                source: "TreeNode.qml"
                onLoaded: {
                    item.nodeData = modelData
                    item.indentLevel = root.indentLevel + 1
                    console.log("Loaded child: " + item.nodeData.name)
                }
            }
        }
    }
}