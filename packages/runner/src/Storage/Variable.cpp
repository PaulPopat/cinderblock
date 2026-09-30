#include "Variable.h"
#include "../CinderblockException.h"

namespace Storage {
struct VariableRegistration {
  char identifier;
  std::function<Variable*(val data)> init;
};

std::vector<VariableRegistration> registered = std::vector<VariableRegistration>();

Variable* Variable::Parse(val value)
{
  auto type_name = value["type"].as<char>();
  for (const auto& entry : registered) {
    if (entry.identifier != type_name) {
      continue;
    }

    return entry.init(value["data"]);
  }

  throw CinderblockException("Unknown variable type");
}

void Variable::Register(char identifier, std::function<Variable*(val data)> init)
{
  registered.push_back({ identifier, init });
}

bool Variable::get_bool() const
{
  throw CinderblockException("Could not get bool");
}

char Variable::get_char() const
{
  throw CinderblockException("Could not get char");
}

int Variable::get_int() const
{
  throw CinderblockException("Could not get int");
}

long long Variable::get_long() const
{
  throw CinderblockException("Could not get long");
}

float Variable::get_float() const
{
  throw CinderblockException("Could not get float");
}

double Variable::get_double() const
{
  throw CinderblockException("Could not get double");
}

std::string Variable::get_string() const
{
  throw CinderblockException("Could not get string");
}

const Variable* Variable::operate_add(const Variable* right) const
{
  throw CinderblockException("Invalid maths");
}

const Variable* Variable::operate_and(const Variable* right) const
{
  throw CinderblockException("Invalid maths");
}

const Variable* Variable::operate_divide(const Variable* right) const
{
  throw CinderblockException("Invalid maths");
}

const Variable* Variable::operate_equals(const Variable* right) const
{
  throw CinderblockException("Invalid maths");
}

const Variable* Variable::operate_greater_than(const Variable* right) const
{
  throw CinderblockException("Invalid maths");
}

const Variable* Variable::operate_greater_than_or_equal_to(const Variable* right) const
{
  throw CinderblockException("Invalid maths");
}

const Variable* Variable::operate_in(const Variable* right) const
{
  throw CinderblockException("Invalid maths");
}

const Variable* Variable::operate_less_than(const Variable* right) const
{
  throw CinderblockException("Invalid maths");
}

const Variable* Variable::operate_less_than_or_equal_to(const Variable* right) const
{
  throw CinderblockException("Invalid maths");
}

const Variable* Variable::operate_multiply(const Variable* right) const
{
  throw CinderblockException("Invalid maths");
}

const Variable* Variable::operate_not_equals(const Variable* right) const
{
  throw CinderblockException("Invalid maths");
}

const Variable* Variable::operate_or(const Variable* right) const
{
  throw CinderblockException("Invalid maths");
}

const Variable* Variable::operate_pipe(const Variable* right) const
{
  throw CinderblockException("Invalid maths");
}

const Variable* Variable::operate_partial_pipe(const Variable* right) const
{
  throw CinderblockException("Invalid maths");
}

const Variable* Variable::operate_subtract(const Variable* right) const
{
  throw CinderblockException("Invalid maths");
}

const Variable* Variable::operate_modulo(const Variable* right) const
{
  throw CinderblockException("Invalid maths");
}
}
