import RestController from './rest-controller';
import Filter from '../auth/filter';

export default class AuthController extends RestController {
    protected authFilters: Filter[] = [];
    protected ignoreMethods: string[] = [];

    constructor(prefix = '', config = {}) {
        super(prefix, config);
        this.runAuthFilter = this.runAuthFilter.bind(this);
    }

    async listWrapper(req, res, next) {
        if (this.ignoreMethods.includes('list')) {
            return super.listWrapper(req, res, next);
        }

        try {
            await this.runAuthFilter(req, res);
        } catch (e) {
            return next(e);
        }

        return super.listWrapper(req, res, next);
    }

    async retrieveWrapper(req, res, next) {
        if (this.ignoreMethods.includes('retrieve')) {
            return super.retrieveWrapper(req, res, next);
        }

        try {
            await this.runAuthFilter(req, res);
        } catch (e) {
            return next(e);
        }

        return super.retrieveWrapper(req, res, next);
    }

    async createWrapper(req, res, next) {
        if (this.ignoreMethods.includes('create')) {
            return super.createWrapper(req, res, next);
        }

        try {
            await this.runAuthFilter(req, res);
        } catch (e) {
            return next(e);
        }

        return super.createWrapper(req, res, next)
    }

    async updateWrapper(req, res, next) {
        if (this.ignoreMethods.includes('update')) {
            return super.updateWrapper(req, res, next);
        }

        try {
            await this.runAuthFilter(req, res);
        } catch (e) {
            return next(e);
        }

        return super.updateWrapper(req, res, next);
    }

    async destroyWrapper(req, res, next) {
        if (this.ignoreMethods.includes('destroy')) {
            return super.destroyWrapper(req, res, next);
        }

        try {
            await this.runAuthFilter(req, res);
        } catch (e) {
            return next(e);
        }

        return super.destroyWrapper(req, res, next);
    }

    private runAuthFilter(req, res): Promise<any> {
        return new Promise((rsv, rr) => {
            Promise.all(this.mapAuthFilters(req, res))
                .then((results) => rsv())
                .catch(err => rr(err));
        })
    }

    private mapAuthFilters(req, res): any {
        return this.authFilters
            .map((f) => f && f.canAccess ? f.canAccess(req, res) : null)
            .filter(f => f != null);
    }
}