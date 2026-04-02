/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { AztecNetwork } from '../nodes/Aztec Network/Aztec Network.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('AztecNetwork Node', () => {
  let node: AztecNetwork;

  beforeAll(() => {
    node = new AztecNetwork();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Aztec Network');
      expect(node.description.name).toBe('aztecnetwork');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Transaction Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.aztec.network',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('sendTransaction operation', () => {
		it('should send transaction successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('sendTransaction')
				.mockReturnValueOnce('0x1234')
				.mockReturnValueOnce('0x5678')
				.mockReturnValueOnce('0x9abc');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				txHash: '0xdef123',
				status: 'pending',
			});

			const result = await executeTransactionOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual({
				txHash: '0xdef123',
				status: 'pending',
			});
		});

		it('should handle send transaction error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('sendTransaction')
				.mockReturnValueOnce('0x1234')
				.mockReturnValueOnce('0x5678')
				.mockReturnValueOnce('0x9abc');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
				new Error('Transaction failed'),
			);
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeTransactionOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('Transaction failed');
		});
	});

	describe('getTransaction operation', () => {
		it('should get transaction successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTransaction')
				.mockReturnValueOnce('0xabc123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				hash: '0xabc123',
				from: '0x123',
				to: '0x456',
				value: '1000',
			});

			const result = await executeTransactionOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.hash).toBe('0xabc123');
		});

		it('should handle get transaction error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTransaction')
				.mockReturnValueOnce('0xabc123');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
				new Error('Transaction not found'),
			);
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeTransactionOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('Transaction not found');
		});
	});

	describe('getTransactions operation', () => {
		it('should get transactions successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTransactions')
				.mockReturnValueOnce('0x123')
				.mockReturnValueOnce(10)
				.mockReturnValueOnce(0);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				transactions: [
					{ hash: '0xabc123' },
					{ hash: '0xdef456' },
				],
				total: 2,
			});

			const result = await executeTransactionOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.transactions).toHaveLength(2);
		});
	});

	describe('getTransactionReceipt operation', () => {
		it('should get transaction receipt successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTransactionReceipt')
				.mockReturnValueOnce('0xabc123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				txHash: '0xabc123',
				status: 'confirmed',
				blockNumber: 12345,
				gasUsed: '21000',
			});

			const result = await executeTransactionOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.status).toBe('confirmed');
		});
	});

	describe('simulateTransaction operation', () => {
		it('should simulate transaction successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('simulateTransaction')
				.mockReturnValueOnce('0x1234')
				.mockReturnValueOnce(0);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				success: true,
				gasEstimate: '21000',
				result: '0x1',
			});

			const result = await executeTransactionOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
		});
	});
});

describe('Account Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.aztec.network'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('createAccount', () => {
    it('should create account successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createAccount')
        .mockReturnValueOnce('0x123abc')
        .mockReturnValueOnce('0x456def');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        success: true,
        address: '0x789ghi',
      });

      const result = await executeAccountOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.success).toBe(true);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.aztec.network/aztec-rpc/create_account',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
        body: {
          signingKey: '0x123abc',
          encryptionKey: '0x456def',
        },
      });
    });

    it('should handle createAccount error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('createAccount');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeAccountOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getAccounts', () => {
    it('should get accounts successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccounts')
        .mockReturnValueOnce(10)
        .mockReturnValueOnce(0);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        accounts: ['0x123', '0x456'],
        total: 2,
      });

      const result = await executeAccountOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.accounts).toHaveLength(2);
    });
  });

  describe('getAccount', () => {
    it('should get account successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccount')
        .mockReturnValueOnce('0x123abc');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        address: '0x123abc',
        publicKey: '0x456def',
      });

      const result = await executeAccountOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.address).toBe('0x123abc');
    });
  });

  describe('getPublicBalance', () => {
    it('should get public balance successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPublicBalance')
        .mockReturnValueOnce('0x123abc')
        .mockReturnValueOnce('0x456def');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        balance: '1000000',
        assetId: '0x456def',
      });

      const result = await executeAccountOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.balance).toBe('1000000');
    });
  });

  describe('getPrivateBalance', () => {
    it('should get private balance successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPrivateBalance')
        .mockReturnValueOnce('0x123abc')
        .mockReturnValueOnce('0x456def');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        balance: '500000',
        assetId: '0x456def',
      });

      const result = await executeAccountOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.balance).toBe('500000');
    });
  });
});

describe('Block Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.aztec.network' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getBlock operation', () => {
    it('should successfully retrieve block by number', async () => {
      const mockBlock = { blockNumber: '123', transactions: [] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlock')
        .mockReturnValueOnce('123')
        .mockReturnValueOnce('');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockBlock);

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockBlock, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.aztec.network/aztec-rpc/get_block',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        qs: { blockNumber: '123' },
        json: true,
      });
    });

    it('should handle getBlock errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlock')
        .mockReturnValueOnce('123')
        .mockReturnValueOnce('');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Block not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Block not found' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getBlockNumber operation', () => {
    it('should successfully get latest block number', async () => {
      const mockBlockNumber = { blockNumber: '456' };
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getBlockNumber');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockBlockNumber);

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockBlockNumber, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.aztec.network/aztec-rpc/get_block_number',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getBlocks operation', () => {
    it('should successfully retrieve blocks in range', async () => {
      const mockBlocks = { blocks: [{ blockNumber: '100' }, { blockNumber: '101' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlocks')
        .mockReturnValueOnce('100')
        .mockReturnValueOnce('200')
        .mockReturnValueOnce(50);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockBlocks);

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockBlocks, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.aztec.network/aztec-rpc/get_blocks',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        qs: { fromBlock: '100', toBlock: '200', limit: 50 },
        json: true,
      });
    });
  });

  describe('getBlockHeader operation', () => {
    it('should successfully get block header', async () => {
      const mockHeader = { blockNumber: '789', hash: '0x123', parentHash: '0x456' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlockHeader')
        .mockReturnValueOnce('789');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockHeader);

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockHeader, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.aztec.network/aztec-rpc/get_block_header',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        qs: { blockNumber: '789' },
        json: true,
      });
    });
  });
});

describe('Contract Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.aztec.network'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('deployContract operation', () => {
    it('should deploy contract successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deployContract')
        .mockReturnValueOnce('0x123abc')
        .mockReturnValueOnce('["arg1", "arg2"]')
        .mockReturnValueOnce('0xsalt123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        contractAddress: '0xdeployed123',
        transactionHash: '0xtx123'
      });

      const result = await executeContractOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.contractAddress).toBe('0xdeployed123');
    });

    it('should handle deployment errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deployContract')
        .mockReturnValueOnce('invalid-bytecode')
        .mockReturnValueOnce('[]')
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Deployment failed'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeContractOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Deployment failed');
    });
  });

  describe('callContract operation', () => {
    it('should call contract function successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('callContract')
        .mockReturnValueOnce('0xcontract123')
        .mockReturnValueOnce('0xfunc123')
        .mockReturnValueOnce('["param1", 123]');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        result: 'success',
        returnValue: 'return_data'
      });

      const result = await executeContractOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.result).toBe('success');
    });
  });

  describe('getContractInstance operation', () => {
    it('should get contract instance successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getContractInstance')
        .mockReturnValueOnce('0xcontract123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        contractAddress: '0xcontract123',
        deployer: '0xdeployer123',
        artifact: {}
      });

      const result = await executeContractOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.contractAddress).toBe('0xcontract123');
    });
  });

  describe('getContractCode operation', () => {
    it('should get contract code successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getContractCode')
        .mockReturnValueOnce('0xcontract123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        bytecode: '0x608060405234801561001057600080fd5b50'
      });

      const result = await executeContractOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.bytecode).toContain('0x');
    });
  });

  describe('addContract operation', () => {
    it('should add contract successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('addContract')
        .mockReturnValueOnce('0xcontract123')
        .mockReturnValueOnce('{"abi": [], "name": "TestContract"}');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        success: true,
        message: 'Contract added successfully'
      });

      const result = await executeContractOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.success).toBe(true);
    });

    it('should handle invalid artifact JSON', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('addContract')
        .mockReturnValueOnce('0xcontract123')
        .mockReturnValueOnce('invalid-json');

      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeContractOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toContain('Invalid contract artifact JSON');
    });
  });
});

describe('Note Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ apiKey: 'test-key', baseUrl: 'https://api.aztec.network' }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  describe('getNotes', () => {
    it('should get notes successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getNotes';
          case 'account': return '0x123';
          case 'contractAddress': return '0x456';
          case 'storageSlot': return '0x0';
          default: return undefined;
        }
      });

      const mockResponse = { notes: [{ id: '1', data: '0xabc' }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNoteOperations.call(mockExecuteFunctions, [{ json: {} }]);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getNotes');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeNoteOperations.call(mockExecuteFunctions, [{ json: {} }]);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('addNote', () => {
    it('should add note successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'addNote';
          case 'note': return '0xabc123';
          case 'contractAddress': return '0x456';
          case 'storageSlot': return '0x0';
          default: return undefined;
        }
      });

      const mockResponse = { success: true, noteId: '123' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNoteOperations.call(mockExecuteFunctions, [{ json: {} }]);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getNoteNonce', () => {
    it('should get note nonce successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getNoteNonce';
          case 'note': return '0xabc123';
          default: return undefined;
        }
      });

      const mockResponse = { nonce: '0x789' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNoteOperations.call(mockExecuteFunctions, [{ json: {} }]);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('syncNotes', () => {
    it('should sync notes successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'syncNotes';
          case 'account': return '0x123';
          case 'fromBlock': return 100;
          case 'toBlock': return 200;
          default: return undefined;
        }
      });

      const mockResponse = { synced: true, noteCount: 5 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNoteOperations.call(mockExecuteFunctions, [{ json: {} }]);
      expect(result[0].json).toEqual(mockResponse);
    });
  });
});

describe('Proof Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.aztec.network' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn() 
      },
    };
  });

  describe('createProof operation', () => {
    it('should create proof successfully', async () => {
      const mockResponse = { proofId: 'proof_123', proof: '0xabc...', status: 'generated' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createProof')
        .mockReturnValueOnce({ input1: 'value1' })
        .mockReturnValueOnce('0x1234567890abcdef');

      const result = await executeProofOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.aztec.network/aztec-rpc/create_proof',
        headers: { 'Authorization': 'Bearer test-key', 'Content-Type': 'application/json' },
        json: true,
        body: { circuitInputs: { input1: 'value1' }, contractAddress: '0x1234567890abcdef' },
      });
    });

    it('should handle createProof error', async () => {
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Proof generation failed'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createProof')
        .mockReturnValueOnce({ input1: 'value1' })
        .mockReturnValueOnce('0x1234567890abcdef');

      const result = await executeProofOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Proof generation failed' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('verifyProof operation', () => {
    it('should verify proof successfully', async () => {
      const mockResponse = { valid: true, verificationResult: 'success' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('verifyProof')
        .mockReturnValueOnce({ proofData: '0xabc...' })
        .mockReturnValueOnce(['input1', 'input2'])
        .mockReturnValueOnce('verification_key_123');

      const result = await executeProofOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.aztec.network/aztec-rpc/verify_proof',
        headers: { 'Authorization': 'Bearer test-key', 'Content-Type': 'application/json' },
        json: true,
        body: { 
          proof: { proofData: '0xabc...' },
          publicInputs: ['input1', 'input2'],
          verificationKey: 'verification_key_123'
        },
      });
    });
  });

  describe('getProofOutput operation', () => {
    it('should get proof output successfully', async () => {
      const mockResponse = { proofId: 'proof_123', output: ['0xresult1', '0xresult2'] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getProofOutput')
        .mockReturnValueOnce('proof_123');

      const result = await executeProofOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.aztec.network/aztec-rpc/get_proof_output',
        headers: { 'Authorization': 'Bearer test-key' },
        json: true,
        qs: { proofId: 'proof_123' },
      });
    });
  });

  describe('simulateProof operation', () => {
    it('should simulate proof successfully', async () => {
      const mockResponse = { simulationResult: 'success', estimatedGas: 150000, outputs: ['0xresult'] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('simulateProof')
        .mockReturnValueOnce({ input1: 'value1' })
        .mockReturnValueOnce('0x1234567890abcdef');

      const result = await executeProofOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.aztec.network/aztec-rpc/simulate_proof',
        headers: { 'Authorization': 'Bearer test-key', 'Content-Type': 'application/json' },
        json: true,
        body: { circuitInputs: { input1: 'value1' }, contractAddress: '0x1234567890abcdef' },
      });
    });
  });
});
});
