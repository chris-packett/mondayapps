const mondayService = require('../services/mondayService');

async function upsertDynamicTypeform (req, res) {
    const { payload } = req.body;
    const { inboundFieldValues } = payload;
    const { boardId } = inboundFieldValues;

    const board = await mondayService.getBoard(process.env.API_TOKEN, boardId);

    return res.status(200).send(board);
}

module.exports = {
    upsertDynamicTypeform
};
