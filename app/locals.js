/**
 * @param {typeof config} config
 */
module.exports =
  (config) =>
  /**
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  (req, res, next) => {
    res.locals.serviceName = config.serviceName

    // Set currentUser for convenience
    if (req.session.data.currentUserId) {
      res.locals.currentUser = req.session.data.users.find((user) => user.id === req.session.data.currentUserId)
    } else {
      res.locals.currentUser = null
    }

    // Set currentOrganisation for convenience
    if (req.session.data.currentOrganisationId) {
      res.locals.currentOrganisation = req.session.data.organisations.find((organisation) => organisation.id === req.session.data.currentOrganisationId)
    } else {
      res.locals.currentOrganisation = null
    }

    next()
  }

/**
 * @import { NextFunction, Request, Response } from 'express'
 * @import config from './config.js'
 */
