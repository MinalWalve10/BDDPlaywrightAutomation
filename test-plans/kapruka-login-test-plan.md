# Kapruka Login Page Test Plan

## Application Overview

Functional and UX test coverage for Kapruka's customer account login page at https://www.kapruka.com/shops/customerAccounts/accountLogin.jsp, including form rendering, input validation, authentication outcomes, password recovery navigation, account creation navigation, and the account-benefits tooltip. Run each test in an isolated, fresh browser context with no pre-existing Kapruka authentication session or browser autofill. Use authorized QA-only accounts and environment-managed credentials; never commit or print secrets. The live page inspection found an email input, a required password input, a Login submit action, a Forgot your password link, a Create Account button, and an Account benefits tooltip. Exact server-side messages and authenticated destinations may vary, so assert the documented outcome rather than hard-coded copy unless the application specification defines it.

## Test Scenarios

### 1. Customer account login

**Seed:** `tests/seed.spec.ts`

#### 1.1. Display the login form in a clean signed-out state

**File:** `tests/account-login/login-page-rendering.spec.ts`

**Steps:**
  1. Open https://www.kapruka.com/shops/customerAccounts/accountLogin.jsp in a fresh browser context with cookies, local storage, and saved form autofill cleared.
    - expect: The page title identifies the account login page and the Your Shopping Account heading is visible.
    - expect: The Kapruka Members section displays an email field, a password field, and a Login action.
    - expect: The password control masks typed characters.
    - expect: The Forgot your password link, Create Account button, and Account benefits control are available.
    - expect: No credentials are prefilled and no prior customer session is active.
  2. Tab through the login-related controls using the keyboard.
    - expect: Focus can reach the email and password fields, Login action, password recovery link, account benefits control, and Create Account button in a usable order.
    - expect: The focused control is visibly indicated and keyboard focus is not trapped.

#### 1.2. Prevent login when the password is missing

**File:** `tests/account-login/login-password-required.spec.ts`

**Steps:**
  1. Start from the clean signed-out login page and enter a syntactically valid QA email address, leaving the password field empty.
    - expect: The email value is displayed in the email field and the password remains blank.
  2. Activate Login.
    - expect: The required password field is identified by browser or application validation.
    - expect: Authentication does not succeed and the browser remains on the login page.
    - expect: No authenticated session is created.

#### 1.3. Reject a malformed email address

**File:** `tests/account-login/login-invalid-email.spec.ts`

**Steps:**
  1. Start from the clean signed-out login page and enter a malformed email value such as qa-invalid-email in the email field.
    - expect: The malformed value is visible in the email field.
  2. Enter any non-empty password reserved for QA testing, then activate Login.
    - expect: Email-format validation is shown by the browser or application.
    - expect: The form does not authenticate the user or establish a session.
    - expect: The user remains able to correct the email value.

#### 1.4. Reject login when the email address is missing

**File:** `tests/account-login/login-missing-email.spec.ts`

**Steps:**
  1. Start from the clean signed-out login page, leave the email field empty, and enter a non-empty QA-only password.
    - expect: The email field remains empty and the password is masked.
  2. Activate Login.
    - expect: The request is rejected with a useful validation or authentication error and the user remains signed out.
    - expect: The page does not reveal internal errors or create an authenticated session.

#### 1.5. Reject incorrect credentials without creating a session

**File:** `tests/account-login/login-invalid-credentials.spec.ts`

**Steps:**
  1. Start from the clean signed-out login page and enter the email of a dedicated QA test account with an intentionally incorrect password.
    - expect: The email value is retained and the password is masked.
  2. Activate Login and wait for the response.
    - expect: Authentication is denied and an actionable error is presented without exposing sensitive details or whether an unrelated email belongs to an account.
    - expect: The user remains on or is returned to the login flow, and no authenticated session is created.
    - expect: The password can be corrected and the form can be resubmitted.

#### 1.6. Log in successfully with an authorized QA account

**File:** `tests/account-login/login-valid-credentials.spec.ts`

**Steps:**
  1. Start from the clean signed-out login page and enter valid credentials from the approved QA credential store.
    - expect: The email is entered and the password is masked; no credential is written to logs or test output.
  2. Activate Login and wait for the authenticated response.
    - expect: The user is authenticated and taken to the expected account page or intended post-login destination.
    - expect: The resulting session is recognized as signed in on a subsequent account-page request.
    - expect: No password or other secret appears in the URL, page content, or test logs.

#### 1.7. Open password recovery from the login page

**File:** `tests/account-login/password-recovery-navigation.spec.ts`

**Steps:**
  1. Start from the clean signed-out login page and activate Forgot your password.
    - expect: The password reset request page opens.
    - expect: The page explains that the customer should enter the email address used for the account and provides an email field and submit action.

#### 1.8. Validate password recovery email input

**File:** `tests/account-login/password-recovery-validation.spec.ts`

**Steps:**
  1. Open the password reset request page from the login page and submit it with the email field empty.
    - expect: Submission is prevented or a clear validation error is displayed.
    - expect: No recovery request is accepted for an empty address.
  2. Enter a malformed email address and submit the recovery request.
    - expect: The address is rejected with a useful validation response and the recovery request is not treated as successful.
  3. Enter the address of a dedicated QA account and submit, using a QA mail sink or approved test mailbox for delivery verification.
    - expect: The page provides an appropriate recovery acknowledgment without exposing account-sensitive information.
    - expect: If email delivery is part of the test environment, a reset message is received by the approved QA mailbox and its reset link opens the password reset flow.

#### 1.9. Open account registration for a new customer

**File:** `tests/account-login/create-account-navigation.spec.ts`

**Steps:**
  1. Start from the clean signed-out login page and activate Create Account.
    - expect: The new account creation page opens at the account registration flow.
    - expect: The page is usable and does not mistakenly authenticate or modify an existing account.

#### 1.10. Show account benefits information

**File:** `tests/account-login/account-benefits-tooltip.spec.ts`

**Steps:**
  1. Start from the clean signed-out login page and activate or focus the Account benefits control.
    - expect: An Account benefits tooltip or equivalent information panel appears and is readable.
    - expect: The login page remains available and no navigation or authentication occurs.
  2. Dismiss the tooltip by moving focus away, pressing Escape if supported, or activating the control again.
    - expect: The tooltip closes or is no longer presented, and the login form remains usable.
