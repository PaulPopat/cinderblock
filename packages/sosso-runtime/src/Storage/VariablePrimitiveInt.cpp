#include "VariablePrimitiveInt.h"
#include "VariablePrimitiveBool.h"

namespace Storage {
VariablePrimitiveInt::VariablePrimitiveInt(int value)
{
  this->value = value;
}

VariablePrimitiveInt::VariablePrimitiveInt(val value)
{
  this->value = value.as<int>();
}

const val VariablePrimitiveInt::raw() const
{
  auto result = val::object();
  result.set("type", this->get_type_name());
  result.set("data", val(this->value));

  return result;
}

int VariablePrimitiveInt::get_value() const
{
  return this->value;
}

char VariablePrimitiveInt::get_char() const
{
  return this->value;
}

int VariablePrimitiveInt::get_int() const
{
  return this->value;
}

long long VariablePrimitiveInt::get_long() const
{
  return this->value;
}

float VariablePrimitiveInt::get_float() const
{
  return this->value;
}

double VariablePrimitiveInt::get_double() const
{
  return this->value;
}

const Variable* VariablePrimitiveInt::operate_add(const Variable* right) const
{
  return new VariablePrimitiveInt(this->value + right->get_int());
}

const Variable* VariablePrimitiveInt::operate_divide(const Variable* right) const
{
  return new VariablePrimitiveInt(this->value / right->get_int());
}

const Variable* VariablePrimitiveInt::operate_equals(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value == right->get_int());
}

const Variable* VariablePrimitiveInt::operate_greater_than(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value > right->get_int());
}

const Variable* VariablePrimitiveInt::operate_greater_than_or_equal_to(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value >= right->get_int());
}

const Variable* VariablePrimitiveInt::operate_less_than(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value < right->get_int());
}

const Variable* VariablePrimitiveInt::operate_less_than_or_equal_to(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value <= right->get_int());
}

const Variable* VariablePrimitiveInt::operate_multiply(const Variable* right) const
{
  return new VariablePrimitiveInt(this->value * right->get_int());
}

const Variable* VariablePrimitiveInt::operate_not_equals(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value != right->get_int());
}

const Variable* VariablePrimitiveInt::operate_subtract(const Variable* right) const
{
  return new VariablePrimitiveInt(this->value - right->get_int());
}

const Variable* VariablePrimitiveInt::operate_modulo(const Variable* right) const
{
  return new VariablePrimitiveInt(this->value % right->get_int());
}
}
