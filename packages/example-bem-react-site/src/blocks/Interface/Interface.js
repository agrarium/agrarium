import React, { Fragment } from 'react';
import { decl, Bem } from 'bem-react-core';

export default decl({
  block: 'Interface',
  tag: 'table',

  content({ declaration }) {
    const props = [].concat(declaration.attributes, declaration.methods);
    return (
      <Fragment>
        <Bem {...{ elem: 'Title', tag: 'caption' }}>API</Bem>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>type</th>
          </tr>
          {props.map((prop, i) => (
            <tr {...{ key: `row-${i}` }}>
              <td>{prop.name}</td>
              <td>{prop.description}</td>
              <td>{prop.type}</td>
            </tr>
          ))}
        </tbody>
      </Fragment>
    );
  }
});
