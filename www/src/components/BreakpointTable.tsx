import * as React from 'react';
import Table from 'react-bootstrap/Table';

const BreakpointTable: React.FC = () => (
  <Table>
    <thead>
      <tr>
        <th>Breakpoint</th>
        <th>Class prefix</th>
        <th>Dimensions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>X-Small</td>
        <td>
          <em>None</em>
        </td>
        <td>&lt;576px</td>
      </tr>
      <tr>
        <td>Small</td>
        <td>
          <code>sm</code>
        </td>
        <td>≥576px</td>
      </tr>
      <tr>
        <td>Medium</td>
        <td>
          <code>md</code>
        </td>
        <td>≥768px</td>
      </tr>
      <tr>
        <td>Large</td>
        <td>
          <code>lg</code>
        </td>
        <td>≥1024px</td>
      </tr>
      <tr>
        <td>Extra large</td>
        <td>
          <code>xl</code>
        </td>
        <td>≥1280px</td>
      </tr>
      <tr>
        <td>Extra extra large</td>
        <td>
          <code>2xl</code> (prop name <code>xxl</code>)
        </td>
        <td>≥1536px</td>
      </tr>
    </tbody>
  </Table>
);

export default BreakpointTable;
