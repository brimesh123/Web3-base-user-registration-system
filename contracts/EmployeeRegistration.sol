// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EmployeeRegistration {
    struct Employee {
        uint id;
        string name;
        string email;
        string position;
    }

    mapping(address => mapping(uint => Employee)) public employees;
    mapping(address => uint) public employeeCount;
    mapping(address => uint[]) public employeeIds;

    event EmployeeRegistered(
        address indexed registrant,
        uint indexed id,
        string name,
        string email,
        string position
    );

    function registerEmployee(
        string memory _name,
        string memory _email,
        string memory _position
    ) public {
        employeeCount[msg.sender]++;
        uint newEmployeeId = employeeCount[msg.sender];

        employees[msg.sender][newEmployeeId] = Employee(
            newEmployeeId,
            _name,
            _email,
            _position
        );
        employeeIds[msg.sender].push(newEmployeeId);

        emit EmployeeRegistered(
            msg.sender,
            newEmployeeId,
            _name,
            _email,
            _position
        );
    }

    function getEmployee(uint _id)
        public
        view
        returns (
            uint,
            string memory,
            string memory,
            string memory
        )
    {
        Employee memory emp = employees[msg.sender][_id];
        require(emp.id != 0, "Employee not found");
        return (emp.id, emp.name, emp.email, emp.position);
    }

    function getAllEmployeeIds() public view returns (uint[] memory) {
        return employeeIds[msg.sender];
    }
}
