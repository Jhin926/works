<%@ page language="java" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:forEach items="${bls}" var="bl" varStatus="vs">
	<tr>
		<td>${bl.bankName }</td>
		<td>${bl.firstLimit }</td>
		<td>${bl.dayLimit }</td>
		<td>${bl.dayMaxLimit }</td>
	</tr>
</c:forEach>