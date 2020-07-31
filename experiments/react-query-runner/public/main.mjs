import QueryStatements from './query_statements.mjs';

const e = React.createElement;

ReactDOM.render(
  e(QueryStatements, {
    stmts: [
      {sql: 'BEGIN;'},
      {sql: 'SELECT *\nFROM users\nWHERE organization_id = 32\n\tAND first_name ILIKE \'%zuuu%\''},
    ]
  }),
  document.getElementById('root')
);
