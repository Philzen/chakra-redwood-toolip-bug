import { Tooltip, Heading, Center } from '@chakra-ui/react'

import { MetaTags } from '@redwoodjs/web'

const TestTooltipPage = () => {
  return (
    <>
      <MetaTags title="TestTooltip" description="TestTooltip page" />

      <Center>
        <Tooltip
          label="Additional Information to be shown here"
          bg="red.600"
          color="black"
        >
          <Heading>Hover me for more</Heading>
        </Tooltip>
      </Center>
    </>
  )
}

export default TestTooltipPage
