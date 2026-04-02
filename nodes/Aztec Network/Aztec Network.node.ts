/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-aztecnetwork/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class AztecNetwork implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Aztec Network',
    name: 'aztecnetwork',
    icon: 'file:aztecnetwork.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Aztec Network API',
    defaults: {
      name: 'Aztec Network',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'aztecnetworkApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Transaction',
            value: 'transaction',
          },
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Block',
            value: 'block',
          },
          {
            name: 'Contract',
            value: 'contract',
          },
          {
            name: 'Note',
            value: 'note',
          },
          {
            name: 'Proof',
            value: 'proof',
          }
        ],
        default: 'transaction',
      },
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['transaction'] } },
	options: [
		{
			name: 'Send Transaction',
			value: 'sendTransaction',
			description: 'Submit a private or public transaction',
			action: 'Send transaction',
		},
		{
			name: 'Get Transaction',
			value: 'getTransaction',
			description: 'Retrieve transaction details by hash',
			action: 'Get transaction',
		},
		{
			name: 'Get Transactions',
			value: 'getTransactions',
			description: 'List transactions for an account',
			action: 'Get transactions',
		},
		{
			name: 'Get Transaction Receipt',
			value: 'getTransactionReceipt',
			description: 'Get transaction receipt and status',
			action: 'Get transaction receipt',
		},
		{
			name: 'Simulate Transaction',
			value: 'simulateTransaction',
			description: 'Simulate transaction execution',
			action: 'Simulate transaction',
		},
	],
	default: 'sendTransaction',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['account'] } },
  options: [
    { name: 'Create Account', value: 'createAccount', description: 'Create a new Aztec account', action: 'Create account' },
    { name: 'Get Accounts', value: 'getAccounts', description: 'List all registered accounts', action: 'Get accounts' },
    { name: 'Get Account', value: 'getAccount', description: 'Get account details and public key', action: 'Get account' },
    { name: 'Get Public Balance', value: 'getPublicBalance', description: 'Get public token balance', action: 'Get public balance' },
    { name: 'Get Private Balance', value: 'getPrivateBalance', description: 'Get private token balance', action: 'Get private balance' }
  ],
  default: 'createAccount',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['block'] } },
  options: [
    { name: 'Get Block', value: 'getBlock', description: 'Retrieve block by number or hash', action: 'Get block' },
    { name: 'Get Block Number', value: 'getBlockNumber', description: 'Get latest block number', action: 'Get block number' },
    { name: 'Get Blocks', value: 'getBlocks', description: 'List blocks in range', action: 'Get blocks' },
    { name: 'Get Block Header', value: 'getBlockHeader', description: 'Get block header only', action: 'Get block header' },
  ],
  default: 'getBlock',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['contract'] } },
  options: [
    { name: 'Deploy Contract', value: 'deployContract', description: 'Deploy a private contract', action: 'Deploy a private contract' },
    { name: 'Call Contract', value: 'callContract', description: 'Call a contract function', action: 'Call a contract function' },
    { name: 'Get Contract Instance', value: 'getContractInstance', description: 'Get deployed contract details', action: 'Get deployed contract details' },
    { name: 'Get Contract Code', value: 'getContractCode', description: 'Retrieve contract bytecode', action: 'Retrieve contract bytecode' },
    { name: 'Add Contract', value: 'addContract', description: 'Register existing contract to account', action: 'Register existing contract to account' }
  ],
  default: 'deployContract',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['note'] } },
  options: [
    { name: 'Get Notes', value: 'getNotes', description: 'Retrieve private notes for account', action: 'Get notes' },
    { name: 'Add Note', value: 'addNote', description: 'Add a note to private state', action: 'Add a note' },
    { name: 'Get Note Nonce', value: 'getNoteNonce', description: 'Get note nonce for nullifier', action: 'Get note nonce' },
    { name: 'Sync Notes', value: 'syncNotes', description: 'Synchronize notes from network', action: 'Sync notes' }
  ],
  default: 'getNotes',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['proof'] } },
  options: [
    { name: 'Create Proof', value: 'createProof', description: 'Generate ZK proof for private function', action: 'Create a proof' },
    { name: 'Verify Proof', value: 'verifyProof', description: 'Verify a zero-knowledge proof', action: 'Verify a proof' },
    { name: 'Get Proof Output', value: 'getProofOutput', description: 'Get proof output data', action: 'Get proof output' },
    { name: 'Simulate Proof', value: 'simulateProof', description: 'Simulate proof generation', action: 'Simulate a proof' },
  ],
  default: 'createProof',
},
{
	displayName: 'Transaction Data',
	name: 'txData',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['sendTransaction'],
		},
	},
	default: '',
	description: 'Hexadecimal encoded transaction data',
},
{
	displayName: 'Proof Data',
	name: 'proofData',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['sendTransaction'],
		},
	},
	default: '',
	description: 'Aztec proof data for private transaction validation',
},
{
	displayName: 'Public Inputs',
	name: 'publicInputs',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['sendTransaction'],
		},
	},
	default: '',
	description: 'Public inputs for the transaction circuit',
},
{
	displayName: 'Transaction Hash',
	name: 'txHash',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransaction', 'getTransactionReceipt'],
		},
	},
	default: '',
	description: 'Transaction hash to retrieve',
},
{
	displayName: 'Account',
	name: 'account',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransactions'],
		},
	},
	default: '',
	description: 'Account address to list transactions for',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransactions'],
		},
	},
	default: 50,
	description: 'Maximum number of transactions to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransactions'],
		},
	},
	default: 0,
	description: 'Number of transactions to skip',
},
{
	displayName: 'Block Height',
	name: 'blockHeight',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['simulateTransaction'],
		},
	},
	default: 0,
	description: 'Block height for simulation (0 for latest)',
},
{
  displayName: 'Signing Key',
  name: 'signingKey',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['createAccount'] } },
  default: '',
  description: 'The signing key for the new account (hexadecimal format)',
},
{
  displayName: 'Encryption Key',
  name: 'encryptionKey',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['createAccount'] } },
  default: '',
  description: 'The encryption key for the new account (hexadecimal format)',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['account'], operation: ['getAccounts'] } },
  default: 10,
  description: 'Maximum number of accounts to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['account'], operation: ['getAccounts'] } },
  default: 0,
  description: 'Number of accounts to skip',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['getAccount', 'getPublicBalance', 'getPrivateBalance'] } },
  default: '',
  description: 'The Aztec account address (hexadecimal format)',
},
{
  displayName: 'Asset ID',
  name: 'assetId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['getPublicBalance', 'getPrivateBalance'] } },
  default: '',
  description: 'The asset ID to check balance for (hexadecimal format)',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  default: '',
  description: 'Block number to retrieve',
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlock', 'getBlockHeader'],
    },
  },
},
{
  displayName: 'Block Hash',
  name: 'blockHash',
  type: 'string',
  default: '',
  description: 'Block hash to retrieve (alternative to block number)',
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlock'],
    },
  },
},
{
  displayName: 'From Block',
  name: 'fromBlock',
  type: 'string',
  default: '',
  description: 'Starting block number for range query',
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlocks'],
    },
  },
},
{
  displayName: 'To Block',
  name: 'toBlock',
  type: 'string',
  default: '',
  description: 'Ending block number for range query',
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlocks'],
    },
  },
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 100,
  description: 'Maximum number of blocks to retrieve',
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlocks'],
    },
  },
},
{
  displayName: 'Contract Bytecode',
  name: 'contractBytecode',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['contract'], operation: ['deployContract'] } },
  default: '',
  description: 'The compiled contract bytecode in hexadecimal format',
},
{
  displayName: 'Constructor Arguments',
  name: 'constructorArgs',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['contract'], operation: ['deployContract'] } },
  default: '[]',
  description: 'Constructor arguments as JSON array',
},
{
  displayName: 'Deployment Salt',
  name: 'deploymentSalt',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['contract'], operation: ['deployContract'] } },
  default: '',
  description: 'Optional deployment salt for deterministic addresses',
},
{
  displayName: 'Contract Address',
  name: 'contractAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['contract'], operation: ['callContract', 'getContractInstance', 'getContractCode', 'addContract'] } },
  default: '',
  description: 'The contract address in hexadecimal format',
},
{
  displayName: 'Function Selector',
  name: 'functionSelector',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['contract'], operation: ['callContract'] } },
  default: '',
  description: 'The function selector hash',
},
{
  displayName: 'Function Arguments',
  name: 'args',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['contract'], operation: ['callContract'] } },
  default: '[]',
  description: 'Function arguments as JSON array',
},
{
  displayName: 'Contract Artifact',
  name: 'contractArtifact',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['contract'], operation: ['addContract'] } },
  default: '',
  description: 'The contract artifact JSON containing ABI and metadata',
},
{
  displayName: 'Account',
  name: 'account',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['note'], operation: ['getNotes', 'syncNotes'] } },
  default: '',
  placeholder: '0x1234...',
  description: 'Account address to retrieve notes for',
},
{
  displayName: 'Contract Address',
  name: 'contractAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['note'], operation: ['getNotes', 'addNote'] } },
  default: '',
  placeholder: '0x1234...',
  description: 'Contract address for note operations',
},
{
  displayName: 'Storage Slot',
  name: 'storageSlot',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['note'], operation: ['getNotes', 'addNote'] } },
  default: '',
  placeholder: '0x0',
  description: 'Storage slot for note operations',
},
{
  displayName: 'Note',
  name: 'note',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['note'], operation: ['addNote', 'getNoteNonce'] } },
  default: '',
  placeholder: '0x...',
  description: 'Note data in hexadecimal format',
},
{
  displayName: 'From Block',
  name: 'fromBlock',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['note'], operation: ['syncNotes'] } },
  default: 0,
  description: 'Starting block number for sync',
},
{
  displayName: 'To Block',
  name: 'toBlock',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['note'], operation: ['syncNotes'] } },
  default: 0,
  description: 'Ending block number for sync (0 for latest)',
},
{
  displayName: 'Circuit Inputs',
  name: 'circuitInputs',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['proof'], operation: ['createProof'] } },
  default: '{}',
  description: 'The circuit inputs for proof generation (JSON format)',
},
{
  displayName: 'Contract Address',
  name: 'contractAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['proof'], operation: ['createProof'] } },
  default: '',
  description: 'The contract address for the proof',
  placeholder: '0x...',
},
{
  displayName: 'Proof',
  name: 'proof',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['proof'], operation: ['verifyProof'] } },
  default: '{}',
  description: 'The proof data to verify (JSON format)',
},
{
  displayName: 'Public Inputs',
  name: 'publicInputs',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['proof'], operation: ['verifyProof'] } },
  default: '[]',
  description: 'The public inputs for proof verification (JSON array format)',
},
{
  displayName: 'Verification Key',
  name: 'verificationKey',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['proof'], operation: ['verifyProof'] } },
  default: '',
  description: 'The verification key for the proof',
},
{
  displayName: 'Proof ID',
  name: 'proofId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['proof'], operation: ['getProofOutput'] } },
  default: '',
  description: 'The ID of the proof to get output for',
},
{
  displayName: 'Circuit Inputs',
  name: 'circuitInputs',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['proof'], operation: ['simulateProof'] } },
  default: '{}',
  description: 'The circuit inputs for proof simulation (JSON format)',
},
{
  displayName: 'Contract Address',
  name: 'contractAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['proof'], operation: ['simulateProof'] } },
  default: '',
  description: 'The contract address for the proof simulation',
  placeholder: '0x...',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'transaction':
        return [await executeTransactionOperations.call(this, items)];
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'block':
        return [await executeBlockOperations.call(this, items)];
      case 'contract':
        return [await executeContractOperations.call(this, items)];
      case 'note':
        return [await executeNoteOperations.call(this, items)];
      case 'proof':
        return [await executeProofOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeTransactionOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('aztecnetworkApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'sendTransaction': {
					const txData = this.getNodeParameter('txData', i) as string;
					const proofData = this.getNodeParameter('proofData', i) as string;
					const publicInputs = this.getNodeParameter('publicInputs', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/aztec-rpc/send_transaction`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
						body: {
							txData,
							proofData,
							publicInputs,
						},
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getTransaction': {
					const txHash = this.getNodeParameter('txHash', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/aztec-rpc/get_transaction`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
						qs: {
							txHash,
						},
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getTransactions': {
					const account = this.getNodeParameter('account', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/aztec-rpc/get_transactions`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
						qs: {
							account,
							limit,
							offset,
						},
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getTransactionReceipt': {
					const txHash = this.getNodeParameter('txHash', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/aztec-rpc/get_transaction_receipt`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
						qs: {
							txHash,
						},
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'simulateTransaction': {
					const txData = this.getNodeParameter('txData', i) as string;
					const blockHeight = this.getNodeParameter('blockHeight', i) as number;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/aztec-rpc/simulate_tx`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
						body: {
							txData,
							blockHeight,
						},
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeAccountOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('aztecnetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createAccount': {
          const signingKey = this.getNodeParameter('signingKey', i) as string;
          const encryptionKey = this.getNodeParameter('encryptionKey', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/aztec-rpc/create_account`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
            body: {
              signingKey,
              encryptionKey,
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccounts': {
          const limit = this.getNodeParameter('limit', i, 10) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/aztec-rpc/get_accounts`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
            qs: {
              limit,
              offset,
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccount': {
          const address = this.getNodeParameter('address', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/aztec-rpc/get_account`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
            qs: {
              address,
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPublicBalance': {
          const address = this.getNodeParameter('address', i) as string;
          const assetId = this.getNodeParameter('assetId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/aztec-rpc/get_public_balance`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
            qs: {
              address,
              assetId,
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPrivateBalance': {
          const address = this.getNodeParameter('address', i) as string;
          const assetId = this.getNodeParameter('assetId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/aztec-rpc/get_private_balance`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
            qs: {
              address,
              assetId,
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeBlockOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('aztecnetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getBlock': {
          const blockNumber = this.getNodeParameter('blockNumber', i) as string;
          const blockHash = this.getNodeParameter('blockHash', i) as string;
          
          const params: any = {};
          if (blockNumber) params.blockNumber = blockNumber;
          if (blockHash) params.blockHash = blockHash;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/aztec-rpc/get_block`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: params,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlockNumber': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/aztec-rpc/get_block_number`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlocks': {
          const fromBlock = this.getNodeParameter('fromBlock', i) as string;
          const toBlock = this.getNodeParameter('toBlock', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;

          const params: any = {
            limit: limit,
          };
          if (fromBlock) params.fromBlock = fromBlock;
          if (toBlock) params.toBlock = toBlock;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/aztec-rpc/get_blocks`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: params,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlockHeader': {
          const blockNumber = this.getNodeParameter('blockNumber', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/aztec-rpc/get_block_header`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: { blockNumber },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeContractOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('aztecnetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'deployContract': {
          const contractBytecode = this.getNodeParameter('contractBytecode', i) as string;
          const constructorArgs = this.getNodeParameter('constructorArgs', i) as string;
          const deploymentSalt = this.getNodeParameter('deploymentSalt', i) as string;

          let parsedArgs: any[] = [];
          try {
            parsedArgs = JSON.parse(constructorArgs);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), 'Invalid constructor arguments JSON');
          }

          const requestBody: any = {
            contractBytecode: contractBytecode.startsWith('0x') ? contractBytecode : `0x${contractBytecode}`,
            constructorArgs: parsedArgs,
          };

          if (deploymentSalt) {
            requestBody.deploymentSalt = deploymentSalt.startsWith('0x') ? deploymentSalt : `0x${deploymentSalt}`;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/aztec-rpc/deploy_contract`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'callContract': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const functionSelector = this.getNodeParameter('functionSelector', i) as string;
          const args = this.getNodeParameter('args', i) as string;

          let parsedArgs: any[] = [];
          try {
            parsedArgs = JSON.parse(args);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), 'Invalid function arguments JSON');
          }

          const requestBody: any = {
            contractAddress: contractAddress.startsWith('0x') ? contractAddress : `0x${contractAddress}`,
            functionSelector: functionSelector.startsWith('0x') ? functionSelector : `0x${functionSelector}`,
            args: parsedArgs,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/aztec-rpc/call_contract`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getContractInstance': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/aztec-rpc/get_contract_instance`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            qs: {
              contractAddress: contractAddress.startsWith('0x') ? contractAddress : `0x${contractAddress}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getContractCode': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/aztec-rpc/get_contract_code`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            qs: {
              contractAddress: contractAddress.startsWith('0x') ? contractAddress : `0x${contractAddress}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'addContract': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const contractArtifact = this.getNodeParameter('contractArtifact', i) as string;

          let parsedArtifact: any;
          try {
            parsedArtifact = JSON.parse(contractArtifact);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), 'Invalid contract artifact JSON');
          }

          const requestBody: any = {
            contractAddress: contractAddress.startsWith('0x') ? contractAddress : `0x${contractAddress}`,
            contractArtifact: parsedArtifact,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/aztec-rpc/add_contract`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeNoteOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('aztecnetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getNotes': {
          const account = this.getNodeParameter('account', i) as string;
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const storageSlot = this.getNodeParameter('storageSlot', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/aztec-rpc/get_notes`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              account,
              contractAddress,
              storageSlot,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'addNote': {
          const note = this.getNodeParameter('note', i) as string;
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const storageSlot = this.getNodeParameter('storageSlot', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/aztec-rpc/add_note`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              note,
              contractAddress,
              storageSlot,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getNoteNonce': {
          const note = this.getNodeParameter('note', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/aztec-rpc/get_note_nonce`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              note,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'syncNotes': {
          const account = this.getNodeParameter('account', i) as string;
          const fromBlock = this.getNodeParameter('fromBlock', i) as number;
          const toBlock = this.getNodeParameter('toBlock', i) as number;

          const body: any = { account };
          if (fromBlock > 0) body.fromBlock = fromBlock;
          if (toBlock > 0) body.toBlock = toBlock;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/aztec-rpc/sync_notes`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeProofOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('aztecnetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createProof': {
          const circuitInputs = this.getNodeParameter('circuitInputs', i) as object;
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/aztec-rpc/create_proof`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
            body: {
              circuitInputs,
              contractAddress,
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'verifyProof': {
          const proof = this.getNodeParameter('proof', i) as object;
          const publicInputs = this.getNodeParameter('publicInputs', i) as any[];
          const verificationKey = this.getNodeParameter('verificationKey', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/aztec-rpc/verify_proof`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
            body: {
              proof,
              publicInputs,
              verificationKey,
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProofOutput': {
          const proofId = this.getNodeParameter('proofId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/aztec-rpc/get_proof_output`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
            qs: {
              proofId,
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'simulateProof': {
          const circuitInputs = this.getNodeParameter('circuitInputs', i) as object;
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/aztec-rpc/simulate_proof`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
            body: {
              circuitInputs,
              contractAddress,
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
