DELIMITER $$
DROP FUNCTION IF EXISTS `fnc_calculate_employee_balance`;
CREATE FUNCTION `fnc_calculate_employee_balance`(p_email VARCHAR(50), p_date VARCHAR(50)) RETURNS DECIMAL(18,4)
    DETERMINISTIC
BEGIN
	DECLARE v_employee_balance DECIMAL(18,4) DEFAULT 0;
	SELECT (u.total_debit + SUM(IF(t.task_type = "DNTU", t.amount, IF(t.task_type = "HTTU", -t.amount, 0)))) INTO v_employee_balance
	FROM workflow.si_user u LEFT JOIN workflow.task t ON u.email = t.author AND DATE_FORMAT(t.created, '%Y-%m-%d') <= STR_TO_DATE(p_date, '%d-%M-%Y')
    WHERE u.email = p_email;
	RETURN v_employee_balance;
END$$
DELIMITER ;