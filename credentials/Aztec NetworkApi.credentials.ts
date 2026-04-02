import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AztecNetworkApi implements ICredentialType {
	name = 'aztecNetworkApi';
	displayName = 'Aztec Network API';
	documentationUrl = 'https://docs.aztec.network/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'API key obtained from the Aztec developer portal',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.aztec.network',
			required: true,
			description: 'Base URL for the Aztec Network API',
		},
	];
}