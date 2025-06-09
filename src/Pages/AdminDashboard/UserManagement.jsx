import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaUserCog, FaShoppingCart, FaGraduationCap, FaMoneyBillWave, FaSearch, FaFilter, FaUserPlus, FaEnvelope, FaPhone, FaCalendarAlt } from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [userPurchases, setUserPurchases] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:4569/api/users/all-users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (userId, currentRole) => {
    setSelectedUser(userId);
    setNewRole(currentRole);
    setShowModal(true);
  };

  const toggleUserRole = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in.');
        return;
      }

      const response = await axios.put(
        'http://localhost:4569/api/users/toggle-role',
        {
          userId: selectedUser,
          newRole: newRole
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setShowModal(false);
        // Update the user in the state
        setUsers(users.map(user => 
          user._id === selectedUser ? { ...user, role: newRole } : user
        ));
      }
    } catch (error) {
      console.error('Error toggling user role:', error);
      setError('Error toggling user role. Please try again later.');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in.');
        return;
      }

      const response = await axios.delete(
        `http://localhost:4569/api/users/delete-user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Remove the user from the state
        setUsers(users.filter(user => user._id !== userId));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Error deleting user. Please try again later.');
    }
  };

  const fetchUserPurchases = async (userId) => {
    try {
      setPurchaseLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in.');
        setPurchaseLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:4569/api/purchases/admin/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUserPurchases(response.data);
        setShowPurchaseModal(true);
      } else {
        setError('Failed to fetch user purchases');
      }
    } catch (error) {
      console.error('Error fetching user purchases:', error);
      setError('Error fetching user purchases. Please try again later.');
    } finally {
      setPurchaseLoading(false);
    }
  };

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesFilter;
  });

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">User Management</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-4 items-center">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center">
            <FaFilter className="text-gray-400 mr-2" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="professor">Professor</option>
              <option value="user">User</option>
            </select>
          </div>
          
          <div className="ml-auto text-sm text-gray-500">
            Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
          </div>
        </div>
      </div>
      
      {/* Card-based layout for users */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentUsers.length > 0 ? (
          currentUsers.map((user) => (
            <div key={user._id} className="bg-white rounded-lg overflow-hidden flex flex-col shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white mr-4 bg-white">
                  <img 
                    src={user.profileImage || 'https://via.placeholder.com/100'} 
                    alt={`${user.firstname} ${user.lastname}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/100?text=' + user.firstname?.charAt(0);
                    }}
                  />
                </div>
                <div className="text-white">
                  <h3 className="text-xl font-semibold">{user.firstname} {user.lastname}</h3>
                  <p className="text-blue-100 text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Role:</span>
                    <span className={`py-1 px-3 rounded-full text-xs ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800 border border-red-200' 
                        : user.role === 'professor' 
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                          : 'bg-green-100 text-green-800 border border-green-200'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  {user.phone && (
                    <div className="flex items-center mb-2">
                      <FaPhone className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{user.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <FaEnvelope className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </div>
                </div>
                
                {user.bio && (
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm line-clamp-3">{user.bio}</p>
                  </div>
                )}
                
                <div className="mt-auto flex flex-wrap gap-2">
                  <button 
                    onClick={() => handleRoleChange(user._id, user.role)}
                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    <FaUserCog className="mr-2" /> Change Role
                  </button>
                  <button 
                    onClick={() => fetchUserPurchases(user._id)}
                    className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    <FaShoppingCart className="mr-2" /> Purchases
                  </button>
                  <button 
                    onClick={() => deleteUser(user._id)}
                    className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 py-8 text-center text-gray-500 bg-white rounded-lg shadow-md">
            No users found matching your search criteria.
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="mt-6 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Show limited page numbers with ellipsis for better UX
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === pageNumber
                        ? 'z-10 bg-blue-500 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                (pageNumber === currentPage - 2 && pageNumber > 1) ||
                (pageNumber === currentPage + 2 && pageNumber < totalPages)
              ) {
                return (
                  <span
                    key={pageNumber}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                );
              }
              return null;
            })}
            
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === totalPages 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      )}

      {/* Modal for changing user role */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Change User Role</h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select New Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="user">User</option>
                <option value="professor">Professor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={toggleUserRole}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for user purchases */}
      {showPurchaseModal && userPurchases && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                Purchase History: {userPurchases.user.name}
              </h3>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* User Purchase Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-500 text-white mr-4">
                    <FaShoppingCart />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Purchases</p>
                    <p className="text-xl font-semibold">{userPurchases.statistics.totalPurchases}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-500 text-white mr-4">
                    <FaMoneyBillWave />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="text-xl font-semibold">${userPurchases.statistics.totalSpent.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-500 text-white mr-4">
                    <FaGraduationCap />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Courses</p>
                    <p className="text-xl font-semibold">{userPurchases.statistics.activeCourses}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-500 text-white mr-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <div className="flex space-x-1">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        {userPurchases.statistics.statusCounts.completed} Completed
                      </span>
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        {userPurchases.statistics.statusCounts.active} Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase List */}
            {userPurchases.purchases.length > 0 ? (
              <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userPurchases.purchases.map((purchase) => (
                      <tr key={purchase._id} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img 
                                className="h-10 w-10 rounded-md object-cover" 
                                src={purchase.course.thumbnail || 'https://via.placeholder.com/40'} 
                                alt={purchase.course.title} 
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{purchase.course.title}</div>
                              <div className="text-xs text-gray-500">{purchase.course.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-900">
                            {purchase.course.instructor.firstname} {purchase.course.instructor.lastname}
                          </div>
                          <div className="text-xs text-gray-500">{purchase.course.instructor.email}</div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900">${purchase.totalAmount.toFixed(2)}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            purchase.paymentType === 'full' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {purchase.paymentType === 'full' ? 'Full Payment' : 'Installment'}
                            {purchase.installmentPlan && ` (${purchase.installmentPlan})`}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            purchase.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : purchase.status === 'active'
                                ? 'bg-blue-100 text-blue-800'
                                : purchase.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                          }`}>
                            {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500">
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                No purchase history found for this user.
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;