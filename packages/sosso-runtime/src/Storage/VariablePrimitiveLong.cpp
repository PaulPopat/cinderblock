#include "VariablePrimitiveLong.h"
#include "VariablePrimitiveBool.h"

namespace Storage {
VariablePrimitiveLong::VariablePrimitiveLong(long long value)
{
  this->value = value;
}

VariablePrimitiveLong::VariablePrimitiveLong(val value)
{
  this->value = value.as<long long>();
}

const val VariablePrimitiveLong::raw() const
{
  auto result = val::object();
  result.set("type", this->get_type_name());
  result.set("data", val(this->value));

  return result;
}

long long VariablePrimitiveLong::get_value() const
{
  return this->value;
}

char VariablePrimitiveLong::get_char() const
{
  return this->value;
}

int VariablePrimitiveLong::get_int() const
{
  return this->value;
}

long long VariablePrimitiveLong::get_long() const
{
  return this->value;
}

float VariablePrimitiveLong::get_float() const
{
  return this->value;
}

double VariablePrimitiveLong::get_double() const
{
  return this->value;
}

const Variable* VariablePrimitiveLong::operate_add(const Variable* right) const
{
  return new VariablePrimitiveLong(this->value + right->get_long());
}

const Variable* VariablePrimitiveLong::operate_divide(const Variable* right) const
{
  return new VariablePrimitiveLong(this->value / right->get_long());
}

const Variable* VariablePrimitiveLong::operate_equals(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value == right->get_long());
}

const Variable* VariablePrimitiveLong::operate_greater_than(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value > right->get_long());
}

const Variable* VariablePrimitiveLong::operate_greater_than_or_equal_to(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value >= right->get_long());
}

const Variable* VariablePrimitiveLong::operate_less_than(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value < right->get_long());
}

const Variable* VariablePrimitiveLong::operate_less_than_or_equal_to(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value <= right->get_long());
}

const Variable* VariablePrimitiveLong::operate_multiply(const Variable* right) const
{
  return new VariablePrimitiveLong(this->value * right->get_long());
}

const Variable* VariablePrimitiveLong::operate_not_equals(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value != right->get_long());
}

const Variable* VariablePrimitiveLong::operate_subtract(const Variable* right) const
{
  return new VariablePrimitiveLong(this->value - right->get_long());
}

const Variable* VariablePrimitiveLong::operate_modulo(const Variable* right) const
{
  return new VariablePrimitiveLong(this->value % right->get_long());
}
}
