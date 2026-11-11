import Table from 'react-bootstrap/Table';

function StackedExample() {
  return (
    <div className="contains-inline">
      <Table stacked="md">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mark Otto</td>
            <td data-cell="Email">mark@example.com</td>
            <td data-cell="Role">Admin</td>
          </tr>
          <tr>
            <td>Jacob Thornton</td>
            <td data-cell="Email">jacob@example.com</td>
            <td data-cell="Role">Editor</td>
          </tr>
          <tr>
            <td>Larry Bird</td>
            <td data-cell="Email">larry@example.com</td>
            <td data-cell="Role">Viewer</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default StackedExample;
