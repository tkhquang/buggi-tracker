import { functions } from "../services/firebase";

// Auth Role Object / Enum
const ROLES = {
  admin: {
    name: "admin",
    level: 0
  },
  owner: {
    name: "owner",
    level: 1
  },
  reporter: {
    name: "reporter",
    level: 2
  }
};

export { ROLES };
