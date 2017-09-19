'use strict';

/**
 * Module dependencies.
 */
 var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke wines Permissions
 */
 exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/wine',
      permissions: '*'
    }, {
      resources: '/api/wine/:wineId',
      permissions: '*'
    }]
  }, {
    roles: ['user', 'admin'],
    allows: [
    {
      resources: '/api/wine',
      permissions: ['get', 'post', 'put']
    },
    {
      resources: '/api/transaction/new',
      permissions: ['get', 'post']
    }, 
    {
      resources: '/api/transaction/remove',
      permissions: ['post']
    }, 
    {
      resources: '/api/transaction/delete',
      permissions: ['post']
    }, 
    {
      resources: '/api/wine/:wineId',
      permissions: ['get']
    },
    {
      resources: '/api/wine/find/grape-variety',
      permissions: ['get']
    },
    {
      resources: '/api/wine/find/unique-producer',
      permissions: ['get']
    },
    {
      resources: '/api/wine/find/unique-wine',
      permissions: ['get']
    },
    {
      resources: '/api/wine/find/source-supplier',
      permissions: ['get']
    },
    {
      resources: '/api/wine/search/:q',
      permissions: ['get']
    },
    {
      resources: '/api/get/expenditure',
      permissions: ['get']
    },
    {
      resources: '/api/get/transaction',
      permissions: ['get']
    },
    {
      resources: '/api/get/inventoryQty',
      permissions: ['get']
    },
    {
      resources: '/api/get/inventoryQty',
      permissions: ['post']
    },
    {
      resources: '/api/get/fxrate-update',
      permissions: ['post']
    },
    {
      resources: '/api/get/fxrate',
      permissions: ['get']
    },
    {
      resources: '/api/position/getPositionbyId/:wineId',
      permissions: ['get']
    },
    {
      resources: '/api/position/score',
      permissions: ['put']
    }    ,
    {
      resources: '/api/wine/rating',
      permissions: ['put']
    },
    {
      resources:'/api/position/getPositionScorebyId',
      permissions:['put']

    },
    {
      resources: '/api/receipt/new',
      permissions: ['post']
    },
    {
      resources: '/api/receipt/delete',
      permissions: ['post']
    },
    {
      resources: '/api/get/receipt',
      permissions: ['get']
    },
    {
      resources:'/api/position/getAvgCommunity',
      permissions:['put']

    },
    {
      resources: '/api/wine/find/producer-location',
      permissions: ['post']
    },
    {
      resources: '/api/wine/find/winesAveragePrice',
      permissions: ['post']
    },
    {
      resources: '/api/wine/get/winesAveragePriceMonthWise',
      permissions: ['post']
    },
    {
      resources: '/api/wine/get/winesAverageBottlesMonthWise',
      permissions: ['post']
    },
    {
      resources: '/api/wine/get/countryGraph',
      permissions: ['post']
    },
    {
      resources: '/api/wine/get/varietalGraph',
      permissions: ['post']
    },
    {
      resources: '/api/wine/get/verticalGraph',
      permissions: ['post']
    },
     {
      resources: '/api/wine/get/wineByUser',
      permissions: ['post']
    },
    {
      resources: '/api/wine/get/producerGraph',
      permissions: ['post']
    },
    {
      resources: '/api/wine/get/regionGraph',
      permissions: ['post']
    },
     {
      resources: '/api/wine/get/lastTransaction',
      permissions: ['post']
    },
    {
      resources: '/api/wine/get/vintageGraph',
      permissions: ['post']
    },
    {
      resources: '/api/wine/get/topDistributors',
      permissions: ['post']
    },
    {
      resources: '/api/wine/get/totalDistributionPrice',
      permissions: ['post']
    }
    ]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/wine',
      permissions: ['get']
    }, {
      resources: '/api/wine/:wineId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If wines Policy Allows
 */
 exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an wine is being processed and the current user created it then allow any manipulation
  if (req.wine && req.user && req.wine.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
