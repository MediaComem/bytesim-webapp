import "./App.css";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { Resizable } from "re-resizable";
import { css } from "@emotion/react";

const panelStyle = css({
  border: "1px solid gray",
  padding: "5px"
});

function App() {
  return (
    <div className="App">
      <Flex css={css({ height: "100vh" })}>
        <Flex flexDirection={"column"} css={panelStyle} alignSelf="stretch">
          <Heading>ByteSim</Heading>
          <Text>
            {
              "Welcome in this amazing tool to analyze the footprint of your website or app with an SVG. Let's do it and get good green recommendations! #happygreen"
            }
          </Text>
        </Flex>
        <Flex flexDirection={"column"} css={panelStyle}>
          Dynamic Form
        </Flex>
          <Resizable
            defaultSize={{
              width: "auto",
              height: "100%"
            }}
            minWidth={200}
            enable={{
              top: false,
              right: false,
              bottom: false,
              left: true,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false
            }}
          >
            <Flex>Draw zone</Flex>
          </Resizable>
      </Flex>
    </div>
  );
}

export default App;
