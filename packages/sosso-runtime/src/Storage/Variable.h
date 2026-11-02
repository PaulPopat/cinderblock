#pragma once

#include <emscripten/val.h>
#include <functional>
#include <vector>

using namespace emscripten;

namespace Storage {
class Variable {
  public:
  static Variable* Parse(val value);
  static void Register(char identifier, std::function<Variable*(val data)> init);

  virtual ~Variable() { }
  virtual const char get_type_name() const = 0;
  virtual const val raw() const = 0;

  virtual bool get_bool() const;
  virtual char get_char() const;
  virtual int get_int() const;
  virtual long long get_long() const;
  virtual float get_float() const;
  virtual double get_double() const;
  virtual std::string get_string() const;

  virtual const Variable* operate_add(const Variable* right) const;
  virtual const Variable* operate_and(const Variable* right) const;
  virtual const Variable* operate_divide(const Variable* right) const;
  virtual const Variable* operate_equals(const Variable* right) const;
  virtual const Variable* operate_greater_than(const Variable* right) const;
  virtual const Variable* operate_greater_than_or_equal_to(const Variable* right) const;
  virtual const Variable* operate_in(const Variable* right) const;
  virtual const Variable* operate_less_than(const Variable* right) const;
  virtual const Variable* operate_less_than_or_equal_to(const Variable* right) const;
  virtual const Variable* operate_multiply(const Variable* right) const;
  virtual const Variable* operate_not_equals(const Variable* right) const;
  virtual const Variable* operate_or(const Variable* right) const;
  virtual const Variable* operate_pipe(const Variable* right) const;
  virtual const Variable* operate_partial_pipe(const Variable* right) const;
  virtual const Variable* operate_subtract(const Variable* right) const;
  virtual const Variable* operate_modulo(const Variable* right) const;
};
}
