export default [
    {
      constant: false,
      inputs: [
        {
          name: '_self',
          type: 'address'
        },
        {
          name: '_newMaster',
          type: 'address'
        }
      ],
      name: 'setMaster',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_self',
          type: 'address'
        },
        {
          name: '_user',
          type: 'address'
        }
      ],
      name: 'isUser',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_self',
          type: 'address'
        },
        {
          name: '_key',
          type: 'bytes32'
        }
      ],
      name: 'storageFor',
      outputs: [
        {
          name: '',
          type: 'bytes32'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_self',
          type: 'address'
        },
        {
          name: '_blockNumber',
          type: 'uint256'
        }
      ],
      name: 'energy',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_self',
          type: 'address'
        },
        {
          name: '_user',
          type: 'address'
        }
      ],
      name: 'removeUser',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_self',
          type: 'address'
        }
      ],
      name: 'currentSponsor',
      outputs: [
        {
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_self',
          type: 'address'
        },
        {
          name: '_credit',
          type: 'uint256'
        },
        {
          name: '_recoveryRate',
          type: 'uint256'
        }
      ],
      name: 'setCreditPlan',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_self',
          type: 'address'
        },
        {
          name: '_sponsor',
          type: 'address'
        }
      ],
      name: 'selectSponsor',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_self',
          type: 'address'
        },
        {
          name: '_blockNumber',
          type: 'uint256'
        }
      ],
      name: 'balance',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_self',
          type: 'address'
        }
      ],
      name: 'sponsor',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_self',
          type: 'address'
        }
      ],
      name: 'creditPlan',
      outputs: [
        {
          name: 'credit',
          type: 'uint256'
        },
        {
          name: 'recoveryRate',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_self',
          type: 'address'
        },
        {
          name: '_user',
          type: 'address'
        }
      ],
      name: 'addUser',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_self',
          type: 'address'
        }
      ],
      name: 'hasCode',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_self',
          type: 'address'
        }
      ],
      name: 'master',
      outputs: [
        {
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_self',
          type: 'address'
        },
        {
          name: '_user',
          type: 'address'
        }
      ],
      name: 'userCredit',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_self',
          type: 'address'
        }
      ],
      name: 'unsponsor',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_self',
          type: 'address'
        },
        {
          name: '_sponsor',
          type: 'address'
        }
      ],
      name: 'isSponsor',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    }
  ]