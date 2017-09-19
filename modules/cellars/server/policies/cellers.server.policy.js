'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke cellers Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/cellers',
      permissions: '*'
    }, {
      resources: '/api/cellers/:cellerId',
      permissions: '*'
    }, {
      resources: '/api/cellers/find/cellar-details',
      permissions: '*'
    },
    {
      resources: '/api/cellers/find/my-cellars',
      permissions: ['post']
    }
    ]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/cellers',
      permissions: ['get', 'post']
    }, {
      resources: '/api/cellers/:cellerId',
      permissions: ['get']
    }, {
      resources: '/api/cellers/find/cellar-details',
      permissions: ['post']
    },
    {
      resources: '/api/cellers/find/my-cellars',
      permissions: ['post']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/cellers',
      permissions: ['get']
    }, {
      resources: '/api/cellers/:cellerId',
      permissions: ['get']
    }, {
      resources: '/api/cellers/find/cellar-details',
      permissions: ['post']
    },
    {
      resources: '/api/cellers/find/my-cellars',
      permissions: ['post']
    }
    ]
  }]);
};

/**
 * Check If cellers Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an celler is being processed and the current user created it then allow any manipulation
  if (req.celler && req.user && req.celler.user.id === req.user.id) {
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
