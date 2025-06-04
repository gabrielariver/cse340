function checkEmployeeOrAdmin(req, res, next) {
  const accountData = res.locals.accountData;

  if (!accountData) {
    req.flash("notice", "Please log in to access this page.");
    return res.redirect("/account/login");
  }

  const { account_type } = accountData;

  if (account_type === "Employee" || account_type === "Admin") {
    return next();
  } else {
    req.flash("notice", "You do not have permission to view this page.");
    return res.redirect("/account/login");
  }
}

module.exports = { checkEmployeeOrAdmin };
