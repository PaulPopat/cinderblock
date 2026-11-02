#include "VariablePrimitiveFloat.h"
#include "VariablePrimitiveBool.h"
#include "../Binary/extract.h"

namespace Storage {
VariablePrimitiveFloat::VariablePrimitiveFloat(float value)
{
  this->value = value;
}

VariablePrimitiveFloat::VariablePrimitiveFloat(val value)
{
  this->value = value.as<float>();
}

const val VariablePrimitiveFloat::raw() const
{
  auto result = val::object();
  result.set("type", this->get_type_name());
  result.set("data", val(this->value));

  return result;
}

float VariablePrimitiveFloat::get_value() const
{
  return this->value;
}

char VariablePrimitiveFloat::get_char() const
{
  return this->value;
}

int VariablePrimitiveFloat::get_int() const
{
  return this->value;
}

long long VariablePrimitiveFloat::get_long() const
{
  return this->value;
}

float VariablePrimitiveFloat::get_float() const
{
  return this->value;
}

double VariablePrimitiveFloat::get_double() const
{
  return this->value;
}

const Variable* VariablePrimitiveFloat::operate_add(const Variable* right) const
{
  return new VariablePrimitiveFloat(this->value + right->get_float());
}

const Variable* VariablePrimitiveFloat::operate_divide(const Variable* right) const
{
  return new VariablePrimitiveFloat(this->value / right->get_float());
}

const Variable* VariablePrimitiveFloat::operate_equals(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value == right->get_float());
}

const Variable* VariablePrimitiveFloat::operate_greater_than(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value > right->get_float());
}

const Variable* VariablePrimitiveFloat::operate_greater_than_or_equal_to(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value >= right->get_float());
}

const Variable* VariablePrimitiveFloat::operate_less_than(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value < right->get_float());
}

const Variable* VariablePrimitiveFloat::operate_less_than_or_equal_to(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value <= right->get_float());
}

const Variable* VariablePrimitiveFloat::operate_multiply(const Variable* right) const
{
  return new VariablePrimitiveFloat(this->value * right->get_float());
}

const Variable* VariablePrimitiveFloat::operate_not_equals(const Variable* right) const
{
  return new VariablePrimitiveBool(this->value != right->get_float());
}

const Variable* VariablePrimitiveFloat::operate_subtract(const Variable* right) const
{
  return new VariablePrimitiveFloat(this->value - right->get_float());
}
}
