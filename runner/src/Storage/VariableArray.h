#include "./Variable.h"
#include <vector>

namespace Storage
{
  class VariableArray : Variable
  {
  public:
    const static char TypeName = 0;
    VariableArray(std::vector<Variable *> values);
    VariableArray(val value);
    ~VariableArray();

    const val raw() const;

  private:
    std::vector<Variable *> values;
  };
}