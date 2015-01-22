package <%=gen.package%>;

public class <%=gen.name%> {


  <%each(entity.attributes, function(attr) {%>
    private <%=attr.type.A()%> <%=attr.name.a()%>;
  <%})%>


  <%each(entity.attributes, function(attr) {%>
    public <%=gen.name%> set<%=attr.name.A()%>(<%=attr.type.A()%> <%=attr.name.a()%>) {
    	this.<%=attr.name.a()%> = <%=attr.name.a()%>;
    	return this;
    }
    public <%=attr.type.A()%> get<%=attr.name.A()%>() {
    	return this.<%=attr.name.a()%>;
    }
  <%})%>
  
}