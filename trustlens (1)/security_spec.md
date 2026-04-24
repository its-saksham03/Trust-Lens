# Security Specification for TrustLens

## Data Invariants
1. A user profile MUST match the authenticated user's UID.
2. An installed app record MUST belong to a valid user profile.
3. A scan result MUST be associated with the user who triggered the scan.
4. Only verified users or specifically authenticated guests can perform writes.
5. All IDs must match standard alphanumeric patterns to prevent injection.

## The "Dirty Dozen" Payloads
1. **Identity Theft**: Attempt to create a profile for `victim_uid` while authenticated as `attacker_uid`.
2. **Shadow Field Injection**: Attempt to create a user with an `isAdmin: true` field.
3. **Resource Exhaustion**: Document ID with 1MB of junk characters.
4. **Relational Orphan**: Create a scan result for a `packageName` that doesn't exist in the library.
5. **PII Leak**: Read another user's private profile data (email/address).
6. **State Skip**: Update an app's `isAnalyzed` to `true` without providing a `currentScore`.
7. **Timestamp Spoofing**: Provide a `createdAt` date from 2001.
8. **Privilege Escalation**: Attempt to delete another user's `installed_apps` subcollection.
9. **Spam Scan**: Create 10,000 scan results in 1 second (handled by quota, but rules should restrict throughput if possible).
10. **Type Poisoning**: Sending a string for the `trustScore` number field.
11. **Email Spoofing**: Authenticating with an unverified email that matches an admin's email.
12. **Anonymous Overreach**: Anonymous user trying to write to the global `apps` catalogue.

## Test Runner (firestore.rules.test.ts)
```typescript
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { setDoc, getDoc, doc } from "firebase/firestore";

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "trustlens-security-test",
    firestore: {
      rules: fs.readFileSync("firestore.rules", "utf8"),
    },
  });
});

test("Unauthorized user cannot read any profile", async () => {
  const unauthedDb = testEnv.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(unauthedDb, "users/any_user")));
});

test("User can only read their own profile", async () => {
  const aliceDb = testEnv.authenticatedContext("alice").firestore();
  await assertSucceeds(getDoc(doc(aliceDb, "users/alice")));
  await assertFails(getDoc(doc(aliceDb, "users/bob")));
});

test("User cannot create profile with admin flag", async () => {
  const aliceDb = testEnv.authenticatedContext("alice").firestore();
  await assertFails(setDoc(doc(aliceDb, "users/alice"), {
    uid: "alice",
    isAdmin: true
  }));
});
```
