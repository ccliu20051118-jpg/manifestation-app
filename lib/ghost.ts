import { SignJWT } from "jose";

const GHOST_URL = process.env.GHOST_URL || "";
const GHOST_ADMIN_API_KEY = process.env.GHOST_ADMIN_API_KEY || "";

async function getAdminToken() {
  const [id, secret] = GHOST_ADMIN_API_KEY.split(":");
  const secretBytes = new Uint8Array(
    secret.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256", kid: id, typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .setAudience("/admin/")
    .sign(secretBytes);

  return token;
}

export async function checkGhostMember(email) {
  try {
    const token = await getAdminToken();
    const url = `${GHOST_URL}/ghost/api/admin/members/?filter=email:'${encodeURIComponent(email)}'`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Ghost ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Ghost API error:", res.status, text);
      return null;
    }

    const data = await res.json();

    if (data.members && data.members.length > 0) {
      const member = data.members[0];
      return {
        name: member.name || "",
        email: member.email,
        status: member.status,
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to check Ghost member:", error);
    return null;
  }
}
