import React from 'react'
import { Client as Styletron } from 'styletron-engine-atomic'
import { Provider as StyletronProvider } from 'styletron-react'
import { HubContext } from './hook/useHub'
import { LightTheme, BaseProvider } from 'baseui'
import { Header } from './components/Header'
import { LogsList } from './components/Logs/List'
import { Center } from './layouts/Center'

const engine = new Styletron()

export function App() {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <Header />
        <Center>
          <HubContext.Provider>
            <LogsList />
          </HubContext.Provider>
        </Center>
      </BaseProvider>
    </StyletronProvider>
  )
}
