package <%= gen.package %>;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import <%= packageBase %>.domain.Author;
import <%= packageBase %>.repository.AuthorRepository;

@EnableAutoConfiguration
@ComponentScan
public class Main implements CommandLineRunner {

    @Autowired
    private AuthorRepository repository;

    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }

    @Override
    public void run(String... args) throws Exception {

        repository.deleteAll();

        // save a couple of authors
        repository.save(new Author().setFirstname("Robert").setLastname("Smith"));
        repository.save(new Author().setFirstname("Robert").setLastname("Steve"));

        // fetch all authors
        System.out.println("Authors found with findAll():");
        System.out.println("-------------------------------");
        for (Author author : repository.findAll()) {
            System.out.println(author);
        }
        System.out.println();

        // fetch an individual author
        System.out.println("Author found with findByFirstname('Robert'):");
        System.out.println("--------------------------------");
        System.out.println(repository.findByFirstname("Robert"));

        System.out.println("Authors found with findByLastname('Smith'):");
        System.out.println("--------------------------------");
        for (Author author : repository.findByLastname("Smith")) {
            System.out.println(author);
        }

    }

}
