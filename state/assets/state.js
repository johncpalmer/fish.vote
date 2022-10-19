import { toast } from 'react-toastify';

export const initialState = {
  distributor: {
    isLoading: false,
    data: []
  },
  timelock: {
    isLoading: false,
    data: []
  },
  vester: {
    isLoading: false,
    data: []
  },
  vex: {
    isLoading: false,
    data: []
  },
  wvet: {
    isLoading: false,
    data: []
  },
  transaction: {}
};

export const ACTIONS = {
  GET_TIMELOCK_BALANCES: 'timelock_balances',
  GET_TIMELOCK_BALANCES_SUCCESS: 'timelock_success',
  GET_TIMELOCK_BALANCES_SUCCESS_ERROR: 'timelock_error',

  GET_VESTER_BALANCES: 'vester_balances',
  GET_VESTER_BALANCES_SUCCESS: 'vester_balances_success',
  GET_VESTER_BALANCES_ERROR: 'vester_balances_error',

  GET_DISTRIBUTOR_BALANCES: 'distributor_balances',
  GET_DISTRIBUTOR_BALANCES_SUCCESS: 'distributor_balances_success',
  GET_DISTRIBUTOR_BALANCES_ERROR: 'distributor_balances_error',

  GET_VEX_BALANCES: 'vex_balances',
  GET_VEX_BALANCES_SUCCESS: 'vex_balances_success',
  GET_VEX_BALANCES_ERROR: 'vex_balances_error',

  GET_WVET_BALANCES: 'wvet_balances',
  GET_WVET_BALANCES_SUCCESS: 'wvet_balances_success',
  GET_WVET_BALANCES_ERROR: 'wvet_balances_error',

  SET_TRANSACTION: 'transaction',
};

export const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.GET_TIMELOCK_BALANCES: {
      return {
        ...state,
        timelock: {
          ...state.timelock,
          isLoading: true
        },
      }
    }
    case ACTIONS.GET_TIMELOCK_BALANCES_SUCCESS: {
      return {
        ...state,
        timelock: {
          ...state.timelock,
          isLoading: false,
          data: action.data,
        },
      }
    }

    case ACTIONS.GET_VESTER_BALANCES: {
      return {
        ...state,
        vester: {
          ...state.vester,
          isLoading: true,

        },
      }
    }
    case ACTIONS.GET_VESTER_BALANCES_SUCCESS: {
      return {
        ...state,
        vester: {
          ...state.vester,
          isLoading: false,
          data: {
            balance: action.data.balance,
            claimableAmount: action.data.claimableAmount,
            address: action.data.address,
          }
        },
      }
    }

    case ACTIONS.GET_DISTRIBUTOR_BALANCES: {
      return {
        ...state,
        distributor: {
          ...state.distributor,
          isLoading: true,

        },
      }
    }
    case ACTIONS.GET_DISTRIBUTOR_BALANCES_SUCCESS: {
      return {
        ...state,
        distributor: {
          ...state.distributor,
          isLoading: false,
          data: action.data,
        },
      }
    }

    case ACTIONS.GET_VEX_BALANCES: {
      return {
        ...state,
        vex: {
          ...state.vex,
          isLoading: true
        },
      }
    }
    case ACTIONS.GET_VEX_BALANCES_SUCCESS: {
      return {
        ...state,
        vex: {
          ...state.vex,
          isLoading: false,
          data: action.data,
        },
      }
    }

    case ACTIONS.GET_WVET_BALANCES: {
      return {
        ...state,
        wvet: {
          ...state.wvet,
          isLoading: true
        },
      }
    }
    case ACTIONS.GET_WVET_BALANCES_SUCCESS: {
      return {
        ...state,
        wvet: {
          ...state.wvet,
          isLoading: false,
          data: action.data,
        },
      }
    }

    case ACTIONS.SET_TRANSACTION: {
      console.log('hit')

      return {
        ...state,
        data: action.data
      }
    }

    default:
      return state;
  }
};
