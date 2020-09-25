const mondaySdk = require('monday-sdk-js');

class MondayService {
  static async getBoard (token, boardId) {
    try {
      const mondayClient = mondaySdk({ token });

      const query = `query($boardId: [Int]) {
        boards (ids: $boardId) {
          name
          columns {
            title
            type
            settings_str
          }
        }
      }`;

      const variables = { boardId };

      const response = await mondayClient.api(query, { variables });

      return response.data.boards[0].columns;
    } catch (err) {
      console.log(err);
    }
  }

  static async getColumnValue (token, itemId, columnId) {
    try {
      const mondayClient = mondaySdk({ token });

      const query = `query($itemId: [Int], $columnId: [String]) {
        items (ids: $itemId) {
          column_values(ids:$columnId) {
            value
          }
        }
      }`;

      const variables = { columnId, itemId };

      const response = await mondayClient.api(query, { variables });

      return response.data.items[0].column_values[0].value;
    } catch (err) {
      console.log(err);
    }
  }

  static async changeColumnValue (token, boardId, itemId, columnId, value) {
    try {
      const mondayClient = mondaySdk({ token });

      const query = `mutation change_column_value($boardId: Int!, $itemId: Int!, $columnId: String!, $value: JSON!) {
        change_column_value(board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
          id
        }
      }`;

      const variables = { boardId, columnId, itemId, value };

      const response = await mondayClient.api(query, { variables });

      return response;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = MondayService;
