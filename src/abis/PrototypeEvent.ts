export default [
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: 'newMaster',
                type: 'address'
            }
        ],
        name: '$Master',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: 'credit',
                type: 'uint256'
            },
            {
                indexed: false,
                name: 'recoveryRate',
                type: 'uint256'
            }
        ],
        name: '$CreditPlan',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'user',
                type: 'address'
            },
            {
                indexed: false,
                name: 'action',
                type: 'bytes32'
            }
        ],
        name: '$User',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'sponsor',
                type: 'address'
            },
            {
                indexed: false,
                name: 'action',
                type: 'bytes32'
            }
        ],
        name: '$Sponsor',
        type: 'event'
    }
]