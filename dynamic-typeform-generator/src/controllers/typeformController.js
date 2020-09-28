const mondayService = require('../services/mondayService');
const typeformService = require('../services/typeformService');

async function upsertDynamicTypeform (req, res) {
    const { payload } = req.body;
    const { inboundFieldValues } = payload;
    const { boardId } = inboundFieldValues;

    const board = await mondayService.getBoard(process.env.API_TOKEN, boardId);

    const formUrl = await typeformService.createForm(req.session.userId, board.name, board.columns);

    return res.status(200).send(formUrl);
}

module.exports = {
    upsertDynamicTypeform
};
