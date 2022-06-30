import "./App.css";
import { Flex, Heading, Text } from "@chakra-ui/react";

function App() {
  return (
    <div className="App">
      <Flex flexDirection={'column'}>
        <Heading>ByteSim</Heading>
        <Text>
          {
            "Welcome in this amazing tool to analyze the footprint of your website or app with an SVG. Let's do it and get good green recommendations! #happygreen"
          }
        </Text>
      </Flex>
    </div>
  );
}

export default App;
