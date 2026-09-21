#include "VariablePrimitiveDouble.h"
#include "../Binary/extract.h"
#include "VariablePrimitiveBool.h"

namespace Storage {
VariablePrimitiveDouble::VariablePrimitiveDouble(double value)
{
  this->value = value;
}

VariablePrimitiveDouble::VariablePrimitiveDouble(val value)
{
  this->value = value.as<double>();
}

const val VariablePrimitiveDouble::raw() const
{
  auto result = val::object();
  result.set("type", this->get_type_name());
  result.set("data", val(this->value));

  return result;
}

double VariablePrimitiveDouble::get_value() const
{
  return this->value;
}

char VariablePrimitiveDouble::get_char() const
{
  return this->value;
}

int VariablePrimitiveDouble::get_int() const
{
  return this->value;
}

long long VariablePrimitiveDouble::get_long() const
{
  return this->value;
}

float VariablePrimitiveDouble::get_float() const
{
  return this->value;
}

double VariablePrimitiveDouble::get_double() const
{
  return this->value;
}

const Variable* VariablePrimitiveDouble::operate_add(const Variable* right) const
{
  return new VariablePrimitiveDouble(this->value + right->get_double());
}

const Variable* VariablePrimitiveDouble::operate_divide(const Variable* right) const
{
  return new VariablePrimitiveDouble(this->value / right->get_double());
}

const Variable* VariablePrimitiveDouble::operate_equals(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value == right->get_double());
}

const Variable* VariablePrimitiveDouble::operate_greater_than(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value > right->get_double());
}

const Variable* VariablePrimitiveDouble::operate_greater_than_or_equal_to(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value >= right->get_double());
}

const Variable* VariablePrimitiveDouble::operate_less_than(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value < right->get_double());
}

const Variable* VariablePrimitiveDouble::operate_less_than_or_equal_to(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value <= right->get_double());
}

const Variable* VariablePrimitiveDouble::operate_multiply(const Variable* right) const
{
  return new VariablePrimitiveDouble(this->value * right->get_double());
}

const Variable* VariablePrimitiveDouble::operate_not_equals(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value != right->get_double());
}

const Variable* VariablePrimitiveDouble::operate_subtract(const Variable* right) const
{
  return new VariablePrimitiveDouble(this->value - right->get_double());
}
}
