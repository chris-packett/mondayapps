const fetch = require('node-fetch');
const tokenStoreService = require('./tokenStoreService');

class TypeformService {
    static async createForm (userId, formName, columns) {
        const textColumns = columns.filter(column => column.type === 'text');

        const typeformToken = await tokenStoreService.getToken(userId, 'typeform');

        const response = await fetch('https://api.typeform.com/forms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + typeformToken
            },
            body: JSON.stringify({
                title: formName,
                fields: textColumns.map(column => {
                    const field = {
                        title: column.title,
                        type: 'short_text'
                    };

                    return field;
                })
            })
        });

        return await response.json();
    }
}

module.exports = TypeformService;