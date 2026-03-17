cmake_minimum_required(VERSION 3.16)

project(homepage VERSION 1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Qt6 6.2 REQUIRED COMPONENTS Quick Network)

qt_standard_project_setup()

qt_add_executable(apphomepage
    src/main.cpp
    src/blogmanager.cpp
    src/blogmanager.h
)

if(CMAKE_SYSTEM_NAME STREQUAL "Emscripten")
    # For WASM build, include the font explicitly
    qt_add_qml_module(apphomepage
        URI homepage
        VERSION 1.0
        QML_FILES qml/main.qml qml/TreeNode.qml
        RESOURCES fonts/NotoSansCJK-Regular.ttc
    )
else()
    # For local Linux build, don't bundle the huge font file
    # to save compile time and binary size
    qt_add_qml_module(apphomepage
        URI homepage
        VERSION 1.0
        QML_FILES qml/main.qml qml/TreeNode.qml
    )
endif()

# Qt for WebAssembly deployment requires special steps but CMake handles the basics automatically
set_target_properties(apphomepage PROPERTIES
    MACOSX_BUNDLE GUICONTRIBUTOR
    WIN32_EXECUTABLE TRUE
)

target_link_libraries(apphomepage
    PRIVATE Qt6::Quick Qt6::Network
)

install(TARGETS apphomepage
    BUNDLE DESTINATION .
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)