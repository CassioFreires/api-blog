"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = checkRole;
function checkRole(allowedRoles) {
    return (req, res, next) => {
        const user = req.user; // ideal tipar corretamente se tiver `JwtUserPayload`
        console.log();
        if (!user || !user.user.role || !allowedRoles.includes(user.user.role.role_name)) {
            res.status(403).json({ message: "Permissão insuficiente" });
            return; // isso evita seguir com next() em caso de erro
        }
        next(); // segue se passar na validação
    };
}
