import React, { Component } from 'react'

import CpnTabler from 'cpn-tabler';

export default class App extends Component {
  render() {

    return (
      <div>
        <CpnTabler
          isLoading={true}
          errorMessage={null}
          configCols={[
            { label: 'ID', key: 'id' }
          ]}
          data={[]}
        />
      </div>
    )
  }
}
