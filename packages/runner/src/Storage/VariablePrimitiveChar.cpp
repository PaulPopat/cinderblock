#include "VariablePrimitiveChar.h"
#include "VariablePrimitiveBool.h"

namespace Storage {
VariablePrimitiveChar::VariablePrimitiveChar(char value)
{
  this->value = value;
}

VariablePrimitiveChar::VariablePrimitiveChar(val value)
{
  this->value = value.as<char>();
}

const val VariablePrimitiveChar::raw() const
{
  auto result = val::object();
  result.set("type", this->get_type_name());
  result.set("data", val(this->value));

  return result;
}

char VariablePrimitiveChar::get_value() const
{
  return this->value;
}

char VariablePrimitiveChar::get_char() const
{
  return this->value;
}

int VariablePrimitiveChar::get_int() const
{
  return this->value;
}

long long VariablePrimitiveChar::get_long() const
{
  return this->value;
}

float VariablePrimitiveChar::get_float() const
{
  return this->value;
}

double VariablePrimitiveChar::get_double() const
{
  return this->value;
}

const Variable* VariablePrimitiveChar::operate_add(const Variable* right) const
{
  return new VariablePrimitiveChar(this->value + right->get_char());
}

const Variable* VariablePrimitiveChar::operate_divide(const Variable* right) const
{
  return new VariablePrimitiveChar(this->value / right->get_char());
}

const Variable* VariablePrimitiveChar::operate_equals(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value == right->get_char());
}

const Variable* VariablePrimitiveChar::operate_greater_than(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value > right->get_char());
}

const Variable* VariablePrimitiveChar::operate_greater_than_or_equal_to(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value >= right->get_char());
}

const Variable* VariablePrimitiveChar::operate_less_than(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value < right->get_char());
}

const Variable* VariablePrimitiveChar::operate_less_than_or_equal_to(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value <= right->get_char());
}

const Variable* VariablePrimitiveChar::operate_multiply(const Variable* right) const
{
  return new VariablePrimitiveChar(this->value * right->get_char());
}

const Variable* VariablePrimitiveChar::operate_not_equals(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value != right->get_char());
}

const Variable* VariablePrimitiveChar::operate_modulo(const Variable* right) const
{
  return new VariablePrimitiveChar(this->value % right->get_char());
}

const Variable* VariablePrimitiveChar::operate_subtract(const Variable* right) const
{
  return new VariablePrimitiveChar(this->value - right->get_char());
}
}
