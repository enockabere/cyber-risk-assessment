import Swal from "sweetalert2";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt?: string;
  lastLogin?: string;
  status?: "active" | "inactive" | "pending";
}

export function showUserViewModal(user: User) {
  Swal.fire({
    title: "User Details",
    html: `
      <div class="text-left space-y-3 p-4">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
            ${(user.name || user.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 class="font-semibold text-lg">${
              user.name || "Unnamed User"
            }</h3>
            <p class="text-gray-500 text-sm">${user.email}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="font-medium text-gray-700">Role:</span>
            <span class="ml-2 px-2 py-1 bg-gray-100 rounded text-sm">${
              user.role
            }</span>
          </div>
          <div>
            <span class="font-medium text-gray-700">Status:</span>
            <span class="ml-2 px-2 py-1 rounded text-sm ${
              user.status === "active"
                ? "bg-green-100 text-green-800"
                : user.status === "inactive"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }">${user.status}</span>
          </div>
          <div>
            <span class="font-medium text-gray-700">Created:</span>
            <span class="ml-2 text-sm">${
              user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Unknown"
            }</span>
          </div>
          <div>
            <span class="font-medium text-gray-700">Last Login:</span>
            <span class="ml-2 text-sm">${
              user.lastLogin
                ? new Date(user.lastLogin).toLocaleDateString()
                : "Never"
            }</span>
          </div>
        </div>
      </div>
    `,
    confirmButtonText: "Close",
    confirmButtonColor: "#3b82f6",
    width: "500px",
  });
}

export function showUserEditModal(
  user: User,
  onSave: (updatedUser: Partial<User> & { password?: string }) => void
) {
  Swal.fire({
    title: "Edit User",
    html: `
      <div class="text-left space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name:</label>
          <input id="userName" class="w-full px-3 py-2 border rounded-md" value="${
            user.name || ""
          }" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email:</label>
          <input id="userEmail" class="w-full px-3 py-2 border rounded-md" value="${
            user.email
          }" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Role:</label>
          <select id="userRole" class="w-full px-3 py-2 border rounded-md">
            <option value="admin" ${
              user.role === "admin" ? "selected" : ""
            }>Admin</option>
            <option value="respondent" ${
              user.role === "respondent" ? "selected" : ""
            }>Respondent</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status:</label>
          <select id="userStatus" class="w-full px-3 py-2 border rounded-md">
            <option value="active" ${
              user.status === "active" ? "selected" : ""
            }>Active</option>
            <option value="inactive" ${
              user.status === "inactive" ? "selected" : ""
            }>Inactive</option>
            <option value="pending" ${
              user.status === "pending" ? "selected" : ""
            }>Pending</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">New Password:</label>
          <input id="userPassword" type="password" class="w-full px-3 py-2 border rounded-md" placeholder="Leave blank to keep current" />
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Save Changes",
    confirmButtonColor: "#3b82f6",
    preConfirm: () => {
      const name = (document.getElementById("userName") as HTMLInputElement)
        ?.value;
      const email = (document.getElementById("userEmail") as HTMLInputElement)
        ?.value;
      const role = (document.getElementById("userRole") as HTMLSelectElement)
        ?.value;
      const status = (
        document.getElementById("userStatus") as HTMLSelectElement
      )?.value;
      const password = (
        document.getElementById("userPassword") as HTMLInputElement
      )?.value;

      return { name, email, role, status, ...(password && { password }) };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      onSave(result.value);
      Swal.fire("Success", "User updated successfully", "success");
    }
  });
}
