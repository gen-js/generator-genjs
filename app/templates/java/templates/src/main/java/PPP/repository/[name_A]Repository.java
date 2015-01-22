package <%= gen.package %>;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import <%= packageBase %>.domain.<%= entity.name.A() %>;

public interface <%= gen.name %> extends MongoRepository<<%= entity.name.A() %>, String> {


  <% each(entity.attributes, function(attr) { %>
    public List<<%= entity.name.A()%>> findBy<%= attr.name.A() %>(<%= attr.type.A() %> <%= attr.name.a() %>);
  <% }) %>

}
