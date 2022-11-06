import {deGatherBlockchain, Block} from "./Block.js";
import { deGatherMempool } from "./Mempool.js";
import { privateKey,publicKey } from "./rsaGenerator.js";

deGatherBlockchain.createPendingBlock();
deGatherBlockchain.pendingBlock.createNewSurvey(publicKey,300,10000,1000,true,privateKey);
deGatherBlockchain.pendingBlock.createNewSurvey(publicKey,300,10000,1000,true,privateKey);
deGatherBlockchain.pendingBlock.createResponse(0,["Yes","Dog"],publicKey,privateKey);

deGatherMempool.verifyAllTransaction();
deGatherMempool.fillPendingBlock();
deGatherBlockchain.addBlock();

console.log(JSON.stringify(deGatherBlockchain.chain,null,4));