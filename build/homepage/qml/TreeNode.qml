import QtQuick
import QtQuick.Controls

Column {
    id: root
    property var nodeData: null
    property int indentLevel: 0
    property bool isExpanded: false
    property string targetTag: ""
    
    spacing: 5
    width: parent ? parent.width : 400
    
    function checkExpansion() {
        if (targetTag !== "" && nodeData && nodeData.isDir) {
            if (nodeData.name === targetTag) {
                isExpanded = true;
            } else if (hasTagInChildren(nodeData, targetTag)) {
                isExpanded = true;
            } else {
            }
        }
        updateChildrenTarget()
    }
    
    function updateChildrenTarget() {
        for (var i = 0; i < childrenRepeater.count; i++) {
            var loader = childrenRepeater.itemAt(i)
            if (loader && loader.item) {
                loader.item.targetTag = root.targetTag
            }
        }
    }
    
    function hasTagInChildren(data, t) {
        if (!data || !data.childNodes) return false;
        var len = data.childNodes.length;
        if (len === undefined) return false;
        for (var i = 0; i < len; i++) {
            var child = data.childNodes[i];
            if (child && child.isDir) {
                if (child.name === t) return true;
                if (hasTagInChildren(child, t)) return true;
            }
            if (child && !child.isDir && child.tags) {
                var tArr = child.tags.split(",");
                if (tArr.indexOf(t) !== -1) return true;
            }
        }
        return false;
    }
    
    onTargetTagChanged: checkExpansion()
    onNodeDataChanged: checkExpansion()
    Component.onCompleted: checkExpansion()

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
                text: root.nodeData ? (root.nodeData.isDir ? (root.isExpanded ? "-" : "+") : "%") : ""
                color: "#aaaaaa"
                font.pixelSize: 16
                anchors.verticalCenter: parent.verticalCenter
            }
            
            Text {
                text: root.nodeData ? root.nodeData.name : ""
                color: root.nodeData && root.nodeData.name === root.targetTag ? "#00ffcc" : "#ffffff"
                font.pixelSize: 16
                font.bold: root.nodeData && root.nodeData.name === root.targetTag
                anchors.verticalCenter: parent.verticalCenter
            }
        }

        MouseArea {
            id: mouseArea
            anchors.fill: parent
            hoverEnabled: true
            cursorShape: Qt.PointingHandCursor
            onClicked: {
                if (typeof window !== "undefined") window.targetExpandedTag = "";
                if (root.nodeData) {
                    if (root.nodeData.isDir) {
                        root.isExpanded = !root.isExpanded
                    } else {
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
            id: childrenRepeater
            model: (root.nodeData && root.nodeData.childNodes) ? root.nodeData.childNodes : []
            delegate: Loader {
                width: childrenCol.width
                source: "TreeNode.qml"
                
                height: item ? item.implicitHeight : 0
                Binding {
                    target: item
                    property: "indentLevel"
                    value: root.indentLevel + 1
                    restoreMode: Binding.RestoreBinding
                }
                onLoaded: {
                    if (item) {
                        item.nodeData = modelData;
                        item.indentLevel = root.indentLevel + 1;
                        item.targetTag = root.targetTag;
                    }
                }
            }
        }
    }
}
